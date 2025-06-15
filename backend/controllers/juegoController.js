const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listarJuegos = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Nuevo: Registrar progreso del usuario en un juego
exports.registrarProgreso = async (req, res) => {
  try {
    const { usuarioId, juegoId, avance, completado } = req.body;
    const progreso = await prisma.progresoUsuario.create({
      data: {
        usuarioId,
        juegoId,
        avance,
        completado
      }
    });
    res.status(201).json(progreso);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.preguntasPorJuego = async (req, res) => {
  try {
    const juegoId = Number(req.params.id);
    const preguntas = await prisma.pregunta.findMany({
      where: { juegoId }
    });
    res.json(preguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
