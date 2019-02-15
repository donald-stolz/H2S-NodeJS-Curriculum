const express = require("express");
const Todo = require("./db/todo.model");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());
app.unsubscribe(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose.connect(
  "mongodb://<username>:<password>@ds133865.mlab.com:33865/heroku_m1jp2bks",
  { useNewUrlParser: true }
);

// Test MongoDB connection
const connection = mongoose.connection;
connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

// Get all todos
app.get("/todos", (req, res) => {
  Todo.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      console.log(todos);

      res.json(todos);
    }
  });
});

// Get single todo by ID
app.get("/todos/:id", (req, res) => {
  let id = req.params.id;
  Todo.findById(id, function(err, todo) {
    res.json(todo);
  });
});

// Add new todo
app.post("/todos", (req, res) => {
  Todo.create(req.body, function(err) {
    if (err) {
      res.status(400).send("adding new todo failed");
    }
  });
  res.status(200).json({ todo: "todo added successfully" });
});

// Update todo by ID
app.post("/todos/:id", (req, res) => {
  Todo.findById(req.params.id, function(err, todo) {
    if (!todo) res.status(404).send("data is not found");
    // Update for new model
    else todo.description = req.body.description;
    todo.title = req.body.title;
    todo.completed = req.body.completed;

    todo
      .save()
      .then(todo => {
        res.json("Todo updated");
      })
      .catch(err => {
        res.status(400).send("Update not possible");
      });
  });
});

// Remove todo by ID
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  // Remove by id
  Todo.deleteOne({ _id: id }, function(err) {
    if (err) {
      return res.status(404).send({
        success: "false",
        message: "todo not found"
      });
    }
    return res.status(200).send({
      success: "true",
      message: "todo was removed"
    });
  });
});

// Run server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
