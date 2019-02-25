const express = require("express");
const bodyParser = require("body-parser");
const mongo = require("mongodb").MongoClient;

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
let todos = undefined;
const url = "mongodb://lucas:42marvin@ds133865.mlab.com:33865/heroku_m1jp2bks";
mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  const db = client.db("heroku_m1jp2bks");
  todos = db.collection("todos");
  console.log("MongoDB database connection established successfully");
});

// Get all todos
app.get("/todos", async (req, res) => {
  let listTodos;
  todos.find({}).toArray(function(err, docs) {
    if (err) {
      res.status(400).send("Failed to fetch todos");
    }
    listTodos = docs;
    res.status(200).json(listTodos);
  });
});

// Get single todo by ID
app.get("/todos/:id", (req, res) => {
  let id = req.params.id;
  todos.findById(id, function(err, todo) {
    res.status(200).json(todo);
  });
});

// Add new todo
app.post("/todos", (req, res) => {
  let todo = req.body;
  if (typeof todo.completed !== "boolean") {
    todo.completed = false;
  }
  todos.create(todo, function(err) {
    if (err) {
      res.status(400).send("Could not add new todo");
    }
  });
  res.status(200).json({ todo: "Todo added" });
});

// Update todo by ID
app.post("/todos/:id", (req, res) => {
  todos.findById(req.params.id, function(err, todo) {
    if (!todo) {
      // If no todo found return error
      res.status(404).send("Could not find todo");
    } else {
      // Update and save todo
      let { description, title, completed } = req.body;
      // Check to see if value exists, if it does replace the value
      todo.title = title ? title : todo.title;
      todo.description = description ? description : todo.description;
      todo.completed = completed ? completed : todo.completed;

      todo
        .save()
        .then(todo => {
          res.status(200).json("Todo updated");
        })
        .catch(err => {
          res.status(400).send("Update not possible");
        });
    }
  });
});

// Remove todo by ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  todos.deleteOne({ _id: id }, function(err) {
    if (err) {
      return res.status(404).send({
        success: "false",
        message: "Could not find todo"
      });
    }
    return res.status(200).send({
      success: "true",
      message: "Removed todo"
    });
  });
});

// Run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
