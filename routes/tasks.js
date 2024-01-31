// routes/tasks.js
const express = require("express");
const { authenticateToken } = require("../auth");
const { authorize } = require("../authorize");
const Task = require("../models/task");

const router = express.Router();

router.get(
  "/tasks",
  authenticateToken,
  authorize(["user", "admin"]),
  async (req, res) => {
    try {
      const {
        page = 1,
        limit = 10,
        sortBy = "createdAt",
        sortOrder = "desc",
        title = "",
      } = req.query;

      const query = {
        title: { $regex: new RegExp(title, "i") },
      };

      const tasks = await Task.find(query)
        .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
        .limit(parseInt(limit))
        .skip((page - 1) * limit);

      res.json(tasks);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
