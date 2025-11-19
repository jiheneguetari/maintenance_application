const mongoose = require("mongoose");

const machineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seuilTemp: { type: Number, required: true },   // ajouté
  seuilVib: { type: Number, required: true },    // ajouté
  lastTemperature: Number,
  lastVibration: Number,
  status: { type: String, default: "normal" }
}, { timestamps: true });

module.exports = mongoose.model("Machine", machineSchema);
