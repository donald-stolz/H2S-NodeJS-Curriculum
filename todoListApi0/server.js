const express = require("express");
const db = require("./db.json");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

// Get all todos
app.get("/todos", (req, res) => {
  res.status(200).send(db);
});

// Get single todo by ID
app.get("/todos/:id", (req, res) => {
  const id = req.params.id;
  const todo = db.find(item => item.id == id);
  if (todo) {
    res.status(200).send(todo);
  } else {
    res.status(404).send("Could not find todo");
  }
});

// Add new todo
app.post("/todos", (req, res) => {
  let { title, description, completed } = req.body;

  // Check if contains proper fields
  if (typeof title === "string" && typeof description === "string") {
    let todo = {
      title,
      description,
      completed: typeof completed === "boolean" ? completed : false
    };
  } else {
    res.status(404).send("ToDo must contain Title & Description");
  }
  // Add ToDo to DB
  db.push(todo);
  let data = JSON.stringify(db);
  fs.writeFile("./db.json", data, "utf8", err => {
    if (err) {
      res.status(404).send(`Failed to add ToDo to db`);
    }
    res.status(200).send(`Added ToDo to db`);
  });
});

// Update todo by ID
app.post("/todos/:id", (req, res) => {
  let id = req.params.id;
  let { title, description, completed } = req.body;

  let todo = db.find(item => item.id == id);
  // Replace nesscary fields
  if (todo) {
    todo = {
      title: title ? title : todo.title,
      description: description ? description : todo.description,
      completed: completed ? completed : todo.completed
    };
    db.push(todo);
    let data = JSON.stringify(db);
    fs.writeFile("./db.json", data, "utf8", err => {
      if (err) {
        res.status(404).send(`Failed to update ${todo.title}.`);
      }
      res.status(200).send(`Updated ${todo.title}`);
    });
  } else {
    res.status(404).send("Could not find todo");
  }
});

// Remove todo by ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  let todos = db.filter(item => item.id == id);
  todos = JSON.stringify(todos);
  fs.writeFile("./db.json", todos, "utf-8", err => {
    if (err) {
      res.status(404).send(`Failed to remove ToDo`);
    }
    res.status(200).send(`Removed ToDo from db`);
  });
});

// Run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
