// controllers/logJuegoController.js
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
