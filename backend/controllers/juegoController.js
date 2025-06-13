const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos los juegos (público)
exports.listarJuegos = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar preguntas por juego
exports.preguntasPorJuego = async (req, res) => {
  try {
    const juegoId = Number(req.params.id);
    const preguntas = await prisma.pregunta.findMany({
      where: { juegoId },
      include: { respuestas: true }
    });
    res.json(preguntas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
