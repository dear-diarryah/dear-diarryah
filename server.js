const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const DB_FILE = path.join(__dirname, 'db', 'database.db');

app.use(bodyParser.json());
app.use(express.static('public'));

const db = new sqlite3.Database(DB_FILE, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY, user_id INTEGER, entry TEXT, FOREIGN KEY(user_id) REFERENCES users(id))");
  }
});

app.post('/signUp', (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  db.run("INSERT INTO users (username, email, password) VALUES (?, ?)", [username, email, hashedPassword], function(err) {
    if (err) {
      return res.status(500).send("Error registering new user");
    }
    const token = jwt.sign({ id: this.lastID }, 'your_secret_key', { expiresIn: 86400 });
    res.status(200).send({ auth: true, token: token });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: 86400 });

    db.all("SELECT * FROM entries WHERE user_id = ?", [user.id], (err, entries) => {
      if (err) return res.status(500).send('Error on the server.');
      res.status(200).send({ auth: true, token: token, entries: entries });
    });
  });
});

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, 'your_secret_key', (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;
    next();
  });
}

app.post('/entries', verifyToken, (req, res) => {
  const { entry } = req.body;
  db.run("INSERT INTO entries (user_id, entry) VALUES (?, ?)", [req.userId, entry], function(err) {
    if (err) return res.status(500).send('Error on the server.');
    res.status(200).send({ message: 'Entry added successfully!' });
  });
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${port}`);
});
