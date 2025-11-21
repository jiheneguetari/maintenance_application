const express = require("express");
const Machine = require("../models/Machine");
const History = require("../models/History");
const Alert = require("../models/Alert");
const router = express.Router();

/* -------------------------
   Ajouter une machine
------------------------- */
router.post("/", async (req, res) => {
  const { name, seuilTemp, seuilVib } = req.body;

  const exist = await Machine.findOne({ name });
  if (exist) return res.status(400).json({ msg: "Nom déjà existe" });

  const machine = await Machine.create({
    name,
    seuilTemp,
    seuilVib,
    lastTemperature: 0,
    lastVibration: 0,
    status: "normal"
  });

  res.json(machine);
});

/* -------------------------
   Obtenir toutes les machines
------------------------- */
router.get("/", async (req, res) => {
    // 1. Obtenir toutes les machines
    const machines = await Machine.find().sort({ createdAt: -1 }).lean(); // Utilisez .lean() pour la performance

    // 2. Trouver toutes les alertes actives et 'en_cours'
    const activeAlerts = await Alert.find({ status: { $in: ["active", "en_cours"] } }).select('machineId');
    const alertingMachineIds = activeAlerts.map(a => a.machineId);

    // 3. Joindre les statuts d'alerte aux machines
    const machinesWithStatus = machines.map(m => {
        const isAlerting = alertingMachineIds.includes(m.name); // Utilisez m.name car c'est le machineId dans les alertes
        
        // Mettez à jour le statut de la machine si nécessaire (sans persistance en BDD)
        return {
            ...m,
            status: isAlerting ? "alert" : "normal"
        };
    });

    res.json(machinesWithStatus);
});
/* -------------------------
   Obtenir machine par ID
------------------------- */
router.get("/:id", async (req, res) => {
  const machine = await Machine.findById(req.params.id);
  res.json(machine);
});

/* -------------------------
   Modifier machine
------------------------- */
router.put("/:id", async (req, res) => {
  const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(updated);
});

/* -------------------------
   Supprimer machine
------------------------- */
router.delete("/:id", async (req, res) => {
  await Machine.findByIdAndDelete(req.params.id);
  res.json({ msg: "Machine supprimée" });
});
router.get("/:id/history", async (req, res) => {
  try {
    const machineId = req.params.id;
    // option : si ton machineId est le nom (field name) et pas l'_id mongo,
    // remplacer la recherche par { machineId: machineId } selon ton design.
    // Ici on suppose machineId stocke le nom (ex: "Machine-01") pas l'_id Mongo
    const { limit = 100, since } = req.query;
    const query = { machineId };

    if (since) query.date = { $gte: new Date(since) };

    const history = await History.find(query)
      .sort({ date: -1 })
      .limit(Number(limit));

    res.json(history);
  } catch (err) {
    console.error("GET /machines/:id/history error:", err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
});


module.exports = router;
