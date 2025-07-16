const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.crearLogError = async (req, res) => {
  try {
    const { usuarioId, juegoId, mensaje, detalle } = req.body;
    const log = await prisma.logError.create({
      data: { usuarioId, juegoId, mensaje, detalle }
    });
    res.status(201).json(log);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};


exports.listarLogErrores = async (req, res) => {
  try {
    const logs = await prisma.logError.findMany({
      orderBy: { fecha: 'desc' },
      include: { usuario: true, juego: true }
    });
    res.json(logs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.obtenerLogErrorPorId = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const log = await prisma.logError.findUnique({
      where: { id },
      include: { usuario: true, juego: true }
    });
    if (!log) return res.status(404).json({ error: 'Log de error no encontrado' });
    res.json(log);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};


exports.eliminarLogError = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.logError.delete({ where: { id } });
    res.json({ mensaje: 'Log de error eliminado' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
