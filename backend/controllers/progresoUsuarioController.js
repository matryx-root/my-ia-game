const { PrismaClient } = require('@prisma/client');

const prisma = require('../prismaClient');

exports.registrarProgreso = async (req, res) => {
  try {
    const { usuarioId, juegoId, avance, completado } = req.body;
    const progreso = await prisma.progresoUsuario.create({
      data: { usuarioId, juegoId, avance, completado }
    });
    res.status(201).json(progreso);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.progresoAlumnosDocente = async (req, res) => {
  const { rol, colegioId } = req.user;
  if (rol !== "docente") return res.status(403).json({ error: "No autorizado" });
  try {
    const progresos = await prisma.progresoUsuario.findMany({
      where: { usuario: { colegioId } },
      include: { usuario: true, juego: true }
    });
    res.json(progresos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
