const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtener todos los juegos registrados
 */
exports.listarJuegos = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany({
      orderBy: { id: 'asc' } // Orden opcional, por claridad
    });
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Crear un nuevo juego
 */
exports.crearJuego = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del juego es obligatorio." });
    }
    const juego = await prisma.juego.create({ data: { nombre, descripcion } });
    res.status(201).json({ mensaje: "Juego creado", juego });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Editar juego por ID
 */
exports.editarJuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del juego es obligatorio." });
    }
    // Verificar existencia antes de actualizar
    const existe = await prisma.juego.findUnique({ where: { id } });
    if (!existe) {
      return res.status(404).json({ error: "Juego no encontrado." });
    }
    const juego = await prisma.juego.update({
      where: { id },
      data: { nombre, descripcion }
    });
    res.json({ mensaje: "Juego actualizado", juego });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/**
 * Eliminar un juego por ID
 */
exports.eliminarJuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.juego.delete({ where: { id } });
    res.json({ mensaje: "Juego eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// controllers/juegoController.js

exports.guardarProgreso = async (req, res) => {
  const { usuarioId, juegoId, avance, completado } = req.body;
  try {
    if (!usuarioId || !juegoId) {
      return res.status(400).json({ error: "usuarioId y juegoId son obligatorios" });
    }
    // Busca si ya existe progreso para este usuario/juego
    const prev = await prisma.progresoUsuario.findFirst({ where: { usuarioId, juegoId } });
    let progreso;
    if (prev) {
      progreso = await prisma.progresoUsuario.update({
        where: { id: prev.id },
        data: { avance, completado, fechaActualizacion: new Date() }
      });
    } else {
      progreso = await prisma.progresoUsuario.create({
        data: { usuarioId, juegoId, avance, completado }
      });
    }
    res.json(progreso);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.guardarLogro = async (req, res) => {
  const { usuarioId, juegoId, nombre, descripcion } = req.body;
  try {
    if (!usuarioId || !nombre) {
      return res.status(400).json({ error: "usuarioId y nombre son obligatorios" });
    }
    const logro = await prisma.achievement.create({
      data: { usuarioId, juegoId, nombre, descripcion }
    });
    res.json(logro);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
