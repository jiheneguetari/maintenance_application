const mongoose = require("mongoose");

const AlertSchema = new mongoose.Schema({
  machineName: String,
  type: String,     // Température | Vibration
  value: Number,
  status: { type: String, default: "Nouveau" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", AlertSchema);
