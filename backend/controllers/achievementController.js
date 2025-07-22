const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.crearAchievement = async (req, res) => {
  try {
    const { usuarioId, juegoId, nombre, descripcion } = req.body;
    const logro = await prisma.achievement.create({
      data: { usuarioId, juegoId, nombre, descripcion }
    });
    res.status(201).json(logro);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.listarAchievementsUsuario = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const logros = await prisma.achievement.findMany({ where: { usuarioId } });
    res.json(logros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
