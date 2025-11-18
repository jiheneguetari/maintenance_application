const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
  const token = req.headers["x-auth-token"];
  if (!token) return res.status(401).json({ msg: "Accès refusé" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(400).json({ msg: "Token invalide" });
  }
};
