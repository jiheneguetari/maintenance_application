const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  machineId: { type: String, required: true, index: true },
  temperature: { type: Number, required: true },
  vibrationValue: { type: Number, required: true },
  date: { type: Date, default: Date.now, index: true }
}, { timestamps: true });

module.exports = mongoose.model("History", historySchema);
