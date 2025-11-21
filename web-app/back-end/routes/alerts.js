const express = require("express");
const Alert = require("../models/Alert");
const Machine = require("../models/Machine");
const History = require("../models/History");

const router = express.Router();

/* ----------------------------------------------------------
   1) ESP32 → Envoi des mesures
---------------------------------------------------------- */
router.post("/esp", async (req, res) => {
  try {
    const { machineId, temperature, vibrationValue, message } = req.body;

    if (!machineId)
      return res.status(400).json({ msg: "machineId manquant" });

    const machine = await Machine.findOne({ name: machineId });
    if (!machine)
      return res.status(404).json({ msg: "Machine inconnue" });

    /* ------------------------------------------------------
       1. Sauvegarde historique (pour /machines/:id/history)
    ------------------------------------------------------ */
    await History.create({
      machineId,
      temperature,
      vibrationValue
    });

    /* ------------------------------------------------------
       2. Mise à jour de la machine (dernières valeurs)
    ------------------------------------------------------ */
    machine.lastTemperature = temperature;
    machine.lastVibration = vibrationValue;
    await machine.save();

    const alerts = [];

    /* ------------------------------------------------------
       3. ALERTES — une seule active à la fois
    ------------------------------------------------------ */

    // --- Température ---
    if (temperature > machine.seuilTemp) {
      const existingTemp = await Alert.findOne({
        machineId,
        type: "temperature",
        status: "active"
      });

      if (!existingTemp) {
        const alertTemp = await Alert.create({
          machineId,
          type: "temperature",
          value: temperature,
          message: message || "Température élevée",
          status: "active"
        });
        alerts.push(alertTemp);
      }
    }

    // --- Vibration ---
    if (vibrationValue > machine.seuilVib) {
      const existingVib = await Alert.findOne({
        machineId,
        type: "vibration",
        status: "active"
      });

      if (!existingVib) {
        const alertVib = await Alert.create({
          machineId,
          type: "vibration",
          value: vibrationValue,
          message: message || "Vibration forte",
          status: "active"
        });
        alerts.push(alertVib);
      }
    }

    return res.json({
      success: true,
      msg: "Données reçues ✔",
      alerts: alerts.length ? alerts : "Aucune nouvelle alerte"
    });

  } catch (err) {
    console.error("Erreur ESP:", err);
    return res.status(500).json({ msg: "Erreur serveur IoT" });
  }
});
router.get("/stats", async (req, res) => {
  try {
    const alerts = await Alert.find();

    // --- Groupement par jour ---
    const byDay = {};
    alerts.forEach(a => {
      const day = a.date.toISOString().split("T")[0];
      byDay[day] = (byDay[day] || 0) + 1;
    });

    // --- Groupement par machine ---
    const byMachine = {};
    alerts.forEach(a => {
      byMachine[a.machineId] = (byMachine[a.machineId] || 0) + 1;
    });

    // --- Groupement par statut ---
    const byStatus = {
      active: alerts.filter(a => a.status === "active").length,
      en_cours: alerts.filter(a => a.status === "en_cours").length,
      resolue: alerts.filter(a => a.status === "resolue").length,
    };

    res.json({
      byDay,
      byMachine,
      byStatus,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur stats" });
  }
});

/* ----------------------------------------------------------
   2) GET — Toutes les alertes
---------------------------------------------------------- */
router.get("/", async (req, res) => {
  const alerts = await Alert.find().sort({ date: -1 });
  res.json(alerts);
});


/* ----------------------------------------------------------
   3) PUT — Modifier uniquement le statut
---------------------------------------------------------- */
router.put("/:id/status", async (req, res) => {
  const { status } = req.body;

  if (!["active", "en_cours", "resolue", "ignoree"].includes(status))
    return res.status(400).json({ msg: "Statut invalide" });

  const updated = await Alert.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(updated);
});


/* ----------------------------------------------------------
   4) GET — Alerte par ID
---------------------------------------------------------- */
router.get("/:id", async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);
    if (!alert)
      return res.status(404).json({ msg: "Alerte introuvable" });

    res.json(alert);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
});


// ----------------------------------------------------------
//  STATS : alertes par jour, semaine, mois, machine
// ----------------------------------------------------------


module.exports = router;
