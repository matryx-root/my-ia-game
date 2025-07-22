
exports.requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.rol)) {
    return res.status(403).json({ error: "No autorizado" });
  }
  next();
};
