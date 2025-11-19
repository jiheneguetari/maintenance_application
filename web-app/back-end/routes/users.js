const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  const exist = await User.findOne({ email });
  if (exist) return res.status(400).json({ msg: "Email existe déjà" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role
  });

  res.json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Utilisateur introuvable" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Mot de passe incorrect" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);

  res.json({ token, user });
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password'); 
    res.json(users);
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({ msg: "Erreur serveur interne" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: "Utilisateur supprimé" });
});

module.exports = router;
