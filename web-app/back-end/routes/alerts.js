const express = require("express");
const Alert = require("../models/Alert");
const router = express.Router();

// GET all alerts
router.get("/", async (req, res) => {
  const alerts = await Alert.find();
  res.json(alerts);
});

// POST new alert
router.post("/", async (req, res) => {
  const alert = await Alert.create(req.body);
  res.json(alert);
});

module.exports = router;
