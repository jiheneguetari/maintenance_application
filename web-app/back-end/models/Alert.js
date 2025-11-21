const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
    machineId: { type: String, required: true },

    type: { 
        type: String, 
        enum: ["temperature", "vibration"], 
        required: true 
    },

    value: { type: Number, required: true },

    status: {
        type: String,
        enum: ["active", "en_cours", "resolue", "ignoree"],
        default: "active"
    },

    message: { type: String },

    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Alert", alertSchema);
