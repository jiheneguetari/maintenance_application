const express = require("express");
const Alert = require("../models/Alert");

const router = express.Router();

// Get all alerts
router.get("/", async (req, res) => {
  const alerts = await Alert.find().sort({ date: -1 });
  res.json(alerts);
});

// Get alert by ID
router.get("/:id", async (req, res) => {
  const alert = await Alert.findById(req.params.id);
  res.json(alert);
});

// Update alert status
router.put("/:id", async (req, res) => {
  const updated = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
