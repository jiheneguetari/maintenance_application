const express = require("express");
const router = express.Router();
const Alert = require("../models/Alert");

const TEMP_THRESHOLD = 20;

router.post("/alert", async (req, res) => {
    const { temperature, vibration, machineId } = req.body;

    if (!temperature || !vibration) {
        return res.status(400).json({ error: "Données manquantes" });
    }

    let message = "Température et vibration normales";

    if (temperature >= TEMP_THRESHOLD) {
        message = "Température élevée !";
    }

    if (vibration === "Vibration forte") {
        message += " Vibration forte détectée !";
    }

    const alert = new Alert({
        temperature,
        vibration,
        machineId: machineId || "Machine-01",
        message
    });

    await alert.save();
    console.log(" Donnée ESP32 enregistrée :", alert);

    res.json({ success: true, message: "Mesure enregistrée" });
});

// dernière mesure
router.get("/alert/last", async (req, res) => {
    const last = await Alert.find().sort({ date: -1 }).limit(1);
    res.json(last);
});

// toutes les mesures
router.get("/alert", async (req, res) => {
    const alerts = await Alert.find().sort({ date: -1 });
    res.json(alerts);
});

module.exports = router;
