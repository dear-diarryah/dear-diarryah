const express = require("express");
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const xml = require('xml');

const app = express();
const port = 3000;
const DB_FILE = path.join(__dirname, "db", "database.db");
const SWAGGER_FILE = JSON.parse(fs.readFileSync(path.join(__dirname, "swagger.json"), "utf8"));

app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(SWAGGER_FILE));
app.use(respondWithFormat);

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
    db.run(
      "CREATE TABLE IF NOT EXISTS profiles (id INTEGER PRIMARY KEY, user_id INTEGER, nickname TEXT, biography TEXT, age INTEGER, rabies_date TEXT, tetanus_date TEXT, borreliose_date TEXT, gender TEXT, FOREIGN KEY(user_id) REFERENCES users(id))"
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
        return res.status(500).sendFormatted({ error: "Error registering new user" });
      }
      const token = jwt.sign({ id: this.lastID }, "W$vaf!d!7oSD31enlSFo9VEF7oRhBTYagHR2$w-lbk6kgIE+7d1BpV3zXvBTdtYB", {
        expiresIn: 86400,
      });
      res.status(200).sendFormatted({ auth: true, token: token });
    }
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).sendFormatted({ error: "Error on the server." });
    if (!user) return res.status(404).sendFormatted({ error: "No user found." });

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid)
      return res.status(401).sendFormatted({ auth: false, token: null });

    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "W$vaf!d!7oSD31enlSFo9VEF7oRhBTYagHR2$w-lbk6kgIE+7d1BpV3zXvBTdtYB", {
      expiresIn: 86400,
    });
    res.status(200).sendFormatted({ auth: true, token: token, isAdmin: user.isAdmin });
  });
});

app.get("/admin/getUsers", verifyToken, (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).sendFormatted({ error: "Access forbidden, you are not an admin." });
  }

  db.all("SELECT * FROM users", [], (err, users) => {
    if (err) {
      res.status(500).sendFormatted({ error: "Error fetching users" });
      return;
    }
    res.status(200).sendFormatted({ users: users });
  });
});

app.patch("/admin/updateUsername/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  const newUsername = req.body.newUsername;

  if (!req.user.isAdmin) {
    return res.status(403).sendFormatted({ error: "Access forbidden, you are not an admin." });
  }

  db.run("UPDATE users SET username = ? WHERE id = ?", [newUsername, userId], (err) => {
    if (err) {
        res.status(500).sendFormatted({ error: "Error while updating username." });
    } else {
        res.sendFormatted({ message: "Username has been updated successfully!" });
    }
  });
});

app.patch("/admin/updatePassword/:userId", verifyToken, (req, res) => {
  const userId = req.params.userId;
  const newPassword = req.body.newPassword;
  const hashedPassword = bcrypt.hashSync(newPassword, 8);

  if (!req.user.isAdmin) {
    return res.status(403).sendFormatted({ error: "Access forbidden, you are not an admin." });
  }

  db.run("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, userId], (err) => {
    if (err) {
        res.status(500).sendFormatted({ error: "Error while updating password." });
    } else {
        res.sendFormatted({ message: "Password has been updated successfully!" });
    }
  });
});

app.delete('/admin/deleteUser/:userId', verifyToken, (req, res) => {
  const userId = req.params.userId;

  if (!req.user.isAdmin) {
    return res.status(403).sendFormatted({ error: "Access forbidden, you are not an admin." });
  }

  db.serialize(() => {
    db.run("BEGIN TRANSACTION");

    db.run("DELETE FROM entries WHERE user_id = ?", [userId], function(err) {
      if (err) {
        db.run("ROLLBACK");
        return res.status(500).sendFormatted({ error: "Error deleting user's entries" });
      }

      db.run("DELETE FROM users WHERE id = ?", [userId], function(err) {
        if (err) {
          db.run("ROLLBACK");
          return res.status(500).sendFormatted({ error: "Error deleting user" });
        }
        if (this.changes === 0) {
          db.run("ROLLBACK");
          return res.status(404).sendFormatted({ error: "User not found or not authorized" });
        }
        db.run("COMMIT");
        res.status(200).sendFormatted({ message: "User and their entries deleted successfully" });
      });
    });
  });
});

app.get("/getEntries", verifyToken, (req, res) => {
  db.all("SELECT * FROM entries WHERE user_id = ?", [req.userId], (err, entries) => {
      if (err) return res.status(500).sendFormatted({ error: "Error on the server." });
      res.status(200).sendFormatted({ entries: entries });
    }
  );
});

app.get("/getEntry/:entryId", verifyToken, (req, res) => {
  const entryId = req.params.entryId;
  console.log(entryId);
  db.get("SELECT * FROM entries WHERE id = ?", [ entryId ], (err, entries) => {
      if (err) return res.status(500).sendFormatted({ error: "Error on the server." });
      res.status(200).sendFormatted({ entries: entries });
    }
  );
});

app.post('/postEntry', verifyToken, async (req, res) => {
  const { title, date, city, content } = req.body;
  const userId = req.userId;

  try {
    const weather = await getWeather(date, city);
    let weatherDescription = weather.forecast.forecastday[0].day.avgtemp_c;

    db.run("INSERT INTO entries (user_id, title, date, city, weather, content) VALUES (?, ?, ?, ?, ?, ?)", [userId, title, date, city, weatherDescription, content], function(err) {
      if (err) {
        return res.status(500).sendFormatted({ error: "Error posting entry" });
      }
      res.status(200).sendFormatted({ message: "Entry posted successfully" });
    });
  } catch {
    res.status(500).sendFormatted({ error: "Error fetching weather data" });
  }
});

app.put('/editEntry/:entryId', verifyToken, (req, res) => {
  const entryId = req.params.entryId;
  const { title, date, city, content } = req.body;

  db.run("UPDATE entries SET title = ?, date = ?, city = ?, content = ? WHERE id = ?", 
    [title, date, city, content, entryId], function(err) {
    if (err) {
      return res.status(500).sendFormatted({ error: 'Error editing entry' });
    }
    if (this.changes === 0) {
      return res.status(404).sendFormatted({ error: 'Entry not found or not authorized' });
    }
    res.status(200).sendFormatted({ message: 'Entry edited successfully' });
  });
});

app.delete('/deleteEntry', verifyToken, (req, res) => {
  const { entryId } = req.body;

  db.run("DELETE FROM entries WHERE id = ? AND user_id = ?", [entryId, req.userId], function(err) {
    if (err) {
      return res.status(500).sendFormatted({ error: 'Error deleting entry' });
    }
    if (this.changes === 0) {
      return res.status(404).sendFormatted({ error: 'Entry not found or not authorized' });
    }
    res.status(200).sendFormatted({ message: 'Entry deleted successfully' });
  });
});

app.post('/updateProfile', verifyToken, (req, res) => {
  const { nickname, biography, age, rabies_date, tetanus_date, borreliose_date, gender } = req.body;
  const userId = req.userId;

  db.get("SELECT * FROM profiles WHERE user_id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).sendFormatted({ error: "Error checking profile existence" });
    }

    if (row) {
      db.run("UPDATE profiles SET nickname = ?, biography = ?, age = ?, rabies_date = ?, tetanus_date = ?, borreliose_date = ?, gender = ? WHERE user_id = ?", 
        [nickname, biography, age, rabies_date, tetanus_date, borreliose_date, gender, userId], function(err) {
        if (err) {
          return res.status(500).sendFormatted({ error: "Error updating profile" });
        }
        res.status(200).sendFormatted({ message: "Profile updated successfully" });
      });
    } else {
      db.run("INSERT INTO profiles (user_id, nickname, biography, age, rabies_date, tetanus_date, borreliose_date, gender) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", 
        [userId, nickname, biography, age, rabies_date, tetanus_date, borreliose_date, gender], function(err) {
        if (err) {
          return res.status(500).sendFormatted({ error: "Error creating profile" });
        }
        res.status(200).sendFormatted({ message: "Profile created successfully" });
      });
    }
  });
});

app.get('/getProfile', verifyToken, (req, res) => {
  const userId = req.userId;

  db.get("SELECT * FROM profiles WHERE user_id = ?", [userId], (err, row) => {
    if (err) {
      return res.status(500).sendFormatted({ error: "Error fetching profile" });
    }
    res.status(200).sendFormatted({ profile: row || null });
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
    res.sendFormatted(data);
  } catch (error) {
    console.error("Error fetching fact data:", error);
    res.status(500).sendFormatted({ error: "Error fetching fact data" });
  }
});

// TomTom API Endpoint
app.get('/api/getTomTomApiKey', (req, res) => {
  const apiKey = 'V6oxeT1AGqkr1FA1CzGwZoafK2DzASxH'
  res.sendFormatted({ apiKey });
});

app.get('/api/veterinarians', async (req, res) => {
  const apiKey = 'V6oxeT1AGqkr1FA1CzGwZoafK2DzASxH';

  try {
    const response = await fetch(`https://api.tomtom.com/search/2/search/veterinarian.json?key=${apiKey}&lat=48.2082&lon=16.3738&radius=15000&limit=50`);
    const data = await response.json();
    res.status(200).sendFormatted(data);
  } catch (error) {
    console.error("Error fetching data from TomTom API:", error);
    res.status(500).sendFormatted({ error: "Error fetching data from TomTom API" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function verifyToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(403).sendFormatted({ auth: false, message: "No token provided." });

  jwt.verify(token, "W$vaf!d!7oSD31enlSFo9VEF7oRhBTYagHR2$w-lbk6kgIE+7d1BpV3zXvBTdtYB", (err, decoded) => {
    if (err)
      return res.status(500).sendFormatted({ auth: false, message: "Failed to authenticate token." });

    req.userId = decoded.id;
    req.user = decoded;

    db.get("SELECT isAdmin FROM users WHERE id = ?", [req.userId], (err, row) => {
      if (err || !row) {
        return res.status(500).sendFormatted({ auth: false, message: "Failed to verify admin status." });
      }
      req.user.isAdmin = row.isAdmin;
      next();
    });
  });
}

function respondWithFormat(req, res, next) {
  res.sendFormatted = (data) => {
    if (req.headers['accept'] === 'application/xml') {
      res.header('Content-Type', 'application/xml');
      res.send(xml(data));
    } else {
      res.json(data);
    }
  };
  next();
}

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
