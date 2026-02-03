const express = require("express");
const multer = require("multer");
const Task = require("../models/Task");

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF allowed"));
    }
  }
});

router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, description, deadline } = req.body;

    const newTask = new Task({
      title,
      description,
      deadline,
      filePath: req.file ? req.file.path : null
    });

    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const tasks = await Task.find();

  const result = tasks.map(task => {
    let displayStatus = "In Progress";

    const now = new Date();
    const deadline = new Date(task.deadline);

    if (task.status === "DONE" && now > deadline) {
      displayStatus = "Achieved";
    } else if (task.status === "TODO" && now >= deadline) {
      displayStatus = "Failed";
    }

    return { ...task._doc, displayStatus };
  });

  res.json(result);
});

router.patch("/:id/done", async (req, res) => {
  await Task.findByIdAndUpdate(req.params.id, { status: "DONE" });
  res.json({ message: "Task marked as DONE" });
});

router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

router.get("/:id/file", async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task.filePath) return res.status(404).json({ error: "No file" });

  res.download(task.filePath);
});

module.exports = router;
