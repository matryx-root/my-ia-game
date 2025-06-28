const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Registrar un error
exports.registrarError = async (req, res) => {
  try {
    const { usuarioId, juegoId, mensaje, detalle } = req.body;
    const error = await prisma.logError.create({
      data: { usuarioId, juegoId, mensaje, detalle }
    });
    res.status(201).json(error);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar logs de errores (opcional: por usuario, por juego)
exports.listarErrores = async (req, res) => {
  const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
  const juegoId = req.query.juegoId ? Number(req.query.juegoId) : undefined;
  try {
    const where = {};
    if (usuarioId) where.usuarioId = usuarioId;
    if (juegoId) where.juegoId = juegoId;

    const errores = await prisma.logError.findMany({
      where,
      orderBy: { fechaHora: 'desc' }
    });
    res.json(errores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
