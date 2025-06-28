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

exports.crearJuego = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const juego = await prisma.juego.create({ data: { nombre, descripcion } });
    res.status(201).json({ mensaje: "Juego creado", juego });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.editarJuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion } = req.body;
    const juego = await prisma.juego.update({
      where: { id },
      data: { nombre, descripcion }
    });
    res.json({ mensaje: "Juego actualizado", juego });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarJuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.juego.delete({ where: { id } });
    res.json({ mensaje: "Juego eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ----- AGREGADO: Registrar progreso -----
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
