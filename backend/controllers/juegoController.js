
const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');


exports.listarJuegos = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany({ orderBy: { id: 'asc' } });
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


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


exports.editarJuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion } = req.body;
    if (!nombre) {
      return res.status(400).json({ error: "El nombre del juego es obligatorio." });
    }
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


exports.eliminarJuego = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.juego.delete({ where: { id } });
    res.json({ mensaje: "Juego eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.guardarProgreso = async (req, res) => {
  const { usuarioId, juegoId, avance, completado, aciertos, desaciertos } = req.body;
  try {
    if (!usuarioId || !juegoId) {
      return res.status(400).json({ error: "usuarioId y juegoId son obligatorios" });
    }

    let data = {
      usuarioId,
      juegoId,
      avance,
      completado,
      fechaActualizacion: new Date()
    };
    if (typeof aciertos !== "undefined") data.aciertos = aciertos;
    if (typeof desaciertos !== "undefined") data.desaciertos = desaciertos;

    
    const progreso = await prisma.progresoUsuario.create({
      data
    });
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


exports.progresoUsuario = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);
    const progresos = await prisma.progresoUsuario.findMany({
      where: { usuarioId },
      include: { juego: true }
    });
    res.json(progresos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.logrosUsuario = async (req, res) => {
  try {
    const usuarioId = Number(req.params.id);
    const logros = await prisma.achievement.findMany({
      where: { usuarioId },
      include: { juego: true }
    });
    res.json(logros);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

