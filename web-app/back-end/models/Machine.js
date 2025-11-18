const mongoose = require("mongoose");

const MachineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  seuilTemp: { type: Number, required: true },
  seuilVib: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Machine", MachineSchema);
