const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ["TODO", "DONE"], default: "TODO" },
  filePath: { type: String },
  createdOn: { type: Date, default: Date.now },
  deadline: { type: Date, required: true }
});

module.exports = mongoose.model("Task", TaskSchema);
