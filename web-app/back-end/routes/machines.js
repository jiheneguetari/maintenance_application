const express = require("express");
const Machine = require("../models/Machine");
const router = express.Router();

// GET all machines
router.get("/", async (req, res) => {
  const machines = await Machine.find();
  res.json(machines);
});

// GET one machine
router.get("/:id", async (req, res) => {
  const machine = await Machine.findById(req.params.id);
  res.json(machine);
});

// POST create new machine
router.post("/", async (req, res) => {
  const machine = await Machine.create(req.body);
  res.json(machine);
});

// PUT update machine
router.put("/:id", async (req, res) => {
  const updated = await Machine.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// DELETE machine
router.delete("/:id", async (req, res) => {
  await Machine.findByIdAndDelete(req.params.id);
  res.json({ msg: "Machine supprimée" });
});

module.exports = router;
