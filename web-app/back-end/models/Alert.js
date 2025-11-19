const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  temperature: { type: Number, required: true },
  vibration: Number,
  machineId: { type: String, required: true },
  message: String,
  status: { type: String, default: "active" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
