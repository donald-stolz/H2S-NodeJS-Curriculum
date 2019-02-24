const express = require("express");
const db = require("./db.json");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

// Add bodyparsing middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Hello world!");
  res.status(200).send("Hello world");
});

// Get all users
app.get("/users", (req, res) => {
  res.status(200).send(db);
});

// Get user by ID
app.get("/users/:id", (req, res) => {
  const { id } = req.params;

  const user = db.find(item => item.id == id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(400).send("Could not find user");
  }
});

// Create new user
app.post("/users", (req, res) => {
  const { name } = req.body;
  if (!name) {
    res.status(404).send("Could not add user");
  }
  let user = {};
  user.name = name;
  user.id = db.length;
  db.push(user);
  // Convert DB to JSON string & write to file
  data = JSON.stringify(db);
  fs.writeFile("./db.json", data, "utf8", err => {
    if (err) {
      res.status(404).send(`Failed to add ${user.name} to db`);
    }
    res.status(200).send(`Added ${user.name} to db`);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
