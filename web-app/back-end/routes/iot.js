const express = require("express");
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");

const router = express.Router();

router.post("/alert", async (req, res) => {
  try {
    const { temperature, vibration, machineId } = req.body;

    if (!temperature || !machineId) {
      return res.status(400).json({ error: "temperature & machineId obligatoires" });
    }

    let message = "Température normale";

    if (temperature > 40) message = " Température élevée";
    if (vibration > 50) message = " Vibration anormale";

    // Save alert
    const alert = await Alert.create({
      temperature,
      vibration,
      machineId,
      message
    });

    // Update Machine last values
    await Machine.findOneAndUpdate(
      { name: machineId },
      {
        lastTemperature: temperature,
        lastVibration: vibration
      },
      { upsert: true }
    );

    res.json({ success: true, alert });

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
