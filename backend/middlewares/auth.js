
const jwt = require('jsonwebtoken');

exports.authMiddleware = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token requerido' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

exports.adminOnlyMiddleware = (req, res, next) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'Token requerido' });
  const token = header.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    if (payload.rol !== 'admin') {
      return res.status(403).json({ error: 'Solo administradores pueden acceder' });
    }
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};
