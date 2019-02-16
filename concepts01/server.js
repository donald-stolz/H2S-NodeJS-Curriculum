const express = require("express");
const db = require("./db.js");
const app = express();

app.get("/", (req, res) => {
  console.log("Hello world!");
  res.status(200).send("Hello world");
});

app.get("/users", (req, res) => {
  res.status(200).send(db);
});

app.get("/users/:id", (req, res) => {
  let { id } = req.params;

  const user = db.find(item => item.id == id);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404).send("Could not find user");
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
