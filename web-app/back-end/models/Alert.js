const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    temperature: { type: Number, required: true },
    vibration: { type: String, required: true },
    machineId: { type: String, default: "Machine-01" },
    message: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
