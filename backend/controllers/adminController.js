const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

// CRUD usuarios (admin)
// Listar todos los usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany();
    res.json(usuarios);  // <-- ESTA LÍNEA es la que React espera
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.crearUsuario = async (req, res) => {
  const { nombre, email, password, rol = 'usuario', edad, celular } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hashed, rol, edad: edad ? Number(edad) : null, celular }
    });
    res.status(201).json({ mensaje: "Usuario creado", usuario });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.editarUsuario = async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, email, rol, edad, celular } = req.body;
  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nombre, email, rol, edad: edad ? Number(edad) : null, celular }
    });
    res.json({ mensaje: "Usuario actualizado", usuario });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.eliminarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.usuario.delete({ where: { id } });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CRUD juegos (admin)
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
