const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Task = require("./task");

const app = express();
const PORT = 8000;

// Connection of MongoDB
mongoose.connect("mongodb://localhost:27017/tasksDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

//Pagination GET/Tasks Route use
app.use("/api", Task);

// GET all tasks

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET a task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// POST a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    const newTask = new Task({ title, description });
    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT  a task by ID
app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required." });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found." });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a task by ID
app.delete("/tasks/:id", async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found." });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
