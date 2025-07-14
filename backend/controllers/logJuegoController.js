const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.registrarLogJuego = async (req, res) => {
  try {
    const { usuarioId, juegoId, accion, detalle, duracion } = req.body;
    const log = await prisma.logJuego.create({
      data: { usuarioId, juegoId, accion, detalle, duracion }
    });
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listarLogsJuego = async (req, res) => {
  try {
    const logs = await prisma.logJuego.findMany({
      include: { usuario: true, juego: true }
    });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
