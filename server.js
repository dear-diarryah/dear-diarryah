const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const app = express();
const port = 3000;
const DB_FILE = path.join(__dirname, "db", "database.db");
const SWAGGER_FILE = JSON.parse(fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8"));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SWAGGER_FILE));

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
    db.run(
      "CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT, isAdmin BOOLEAN)"
    );
    db.run(
      "CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, user_id INTEGER, title TEXT, date TEXT, city TEXT, weather TEXT, content TEXT, FOREIGN KEY(user_id) REFERENCES users(id))"
    );
  }
});

app.post("/signUp", (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run(
    "INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, 0)",
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(500).send("Error registering new user");
      }
      const token = jwt.sign({ id: this.lastID }, "your_secret_key", {
        expiresIn: 86400,
      });
      res.status(200).send({ auth: true, token: token });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).send("Error on the server.");
    if (!user) return res.status(404).send("No user found.");

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid)
      return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "your_secret_key", {
      expiresIn: 86400,
    });
    res.status(200).send({ auth: true, token: token, isAdmin: user.isAdmin });
  });
});

app.get("/admin/getUsers",  verifyToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access forbidden, you are not an admin." });
  }

  db.all("SELECT * FROM users", [], (err, users) => {
    if (err) {
      res.status(500).send("Error fetching users");
      return;
    }
    res.status(200).send({ users: users });
  });
});

app.put("/admin/updateUsername/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  const newUsername = req.body.newUsername;

  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Access forbidden, you are not an admin." });
  }

  db.run("UPDATE users SET username = ? WHERE id = ?", [newUsername, userId], (err) => {
    if (err) {
        res.status(500).json({ error: "Error while updating username." });
    } else {
        res.json({ message: "Username has been updated successfully!" });
    }
  });
});

app.get("/getEntries", verifyToken, (req, res) => {
  db.all("SELECT * FROM entries WHERE user_id = ?", [req.userId], (err, entries) => {
      if (err) return res.status(500).send("Error on the server.");
      res.status(200).send({ entries: entries });
    }
  );
});

app.post('/postEntry', verifyToken, async (req, res) => {
  const { title, date, city, content } = req.body;
  const userId = req.userId;

  try {
    const weather = await getWeather(date, city);
    let weatherDescription = weather.forecast.forecastday[0].day.avgtemp_c;

    db.run("INSERT INTO entries (user_id, title, date, city, weather, content) VALUES (?, ?, ?, ?, ?, ?)", [userId, title, formatDate(date), city, weatherDescription, content], function(err) {
      if (err) {
        return res.status(500).send("Error posting entry");
      }
      res.status(200).send({ message: "Entry posted successfully" });
    });
  } catch {
    res.status(500).send("Error fetching weather data");
  }
});

app.put('/editEntry', verifyToken, (req, res) => {
  const { entryId } = req.body;
  //TODO
});

app.delete('/deleteEntry', verifyToken, (req, res) => {
  const { entryId } = req.body;

  db.run("DELETE FROM entries WHERE id = ? AND user_id = ?", [entryId, req.userId], function(err) {
    if (err) {
      return res.status(500).send('Error deleting entry');
    }
    if (this.changes === 0) {
      return res.status(404).send('Entry not found or not authorized');
    }
    res.status(200).send('Entry deleted successfully');
  });
});

/*https://dogapi.dog/docs/api-v2*/
app.get('/api/fact', async (req, res) => {
  const url = `https://dogapi.dog/api/v2/facts?limit=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error.message);
    }
    res.json(data);
  } catch (error) {
    console.error("Error fetching fact data:", error);
    res.status(500).json({ error: "Error fetching fact data" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).send({ auth: false, message: "No token provided." });

  jwt.verify(token, "your_secret_key", (err, decoded) => {
    if (err)
      return res.status(500).send({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    req.user = decoded;

    db.get("SELECT isAdmin FROM users WHERE id = ?", [req.userId], (err, row) => {
      if (err || !row) {
        return res.status(500).send({ auth: false, message: "Failed to verify admin status." });
      }
      req.user.isAdmin = row.isAdmin;
      next();
    });
  });
}


function formatDate(dateString) {
  const [year, month, day] = dateString.split("-");
  return `${day}.${month}.${year}`;
};

async function getWeather(date, city) {
  const apiKey = "4d04315071d04020aca153414241606";
  const url = `http://api.weatherapi.com/v1/history.json?key=${apiKey}&q=${city}&dt=${date}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (response.status !== 200) {
      throw new Error(data.error.message);
    }
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
