const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// REGISTRO de usuario (alumno o docente)
exports.registrar = async (req, res) => {
  const { nombre, email, password, edad, celular, rol, colegioId } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashed,
        rol, // "alumno" o "docente"
        colegioId: colegioId ? Number(colegioId) : null,
        edad: edad ? Number(edad) : null,
        celular
      },
      include: { colegio: true } // Para enviar el colegio de inmediato
    });
    res.status(201).json({ mensaje: "Usuario registrado", usuario });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN (devuelve token y usuario con colegio)
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Incluye el colegio en la búsqueda
    const user = await prisma.usuario.findUnique({
      where: { email },
      include: { colegio: true }
    });
    if (!user) return res.status(401).json({ error: 'correo_no_existe' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'password_incorrecta' });

    // Registro de LogIngreso (opcional)
    await prisma.logIngreso.create({
      data: { usuarioId: user.id, ip: req.ip, userAgent: req.headers['user-agent'] }
    });

    const token = jwt.sign(
      { id: user.id, rol: user.rol, colegioId: user.colegioId },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );
    res.json({ token, usuario: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ENDPOINT PERFIL (autenticado, siempre incluye colegio)
exports.perfilMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      include: { colegio: true }
    });
    if (!usuario) return res.status(404).json({ error: 'no_encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LISTAR USUARIOS (con filtro de rol/colegio para docentes)
exports.listarUsuarios = async (req, res) => {
  const { rol, colegioId } = req.user;
  let where = {};
  if (rol === "docente") {
    where = { rol: "alumno", colegioId };
  }
  try {
    const usuarios = await prisma.usuario.findMany({
      where,
      include: { colegio: true }
    });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// VER PERFIL (por id)
exports.verPerfil = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { colegio: true, configuracion: true }
    });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// EDITAR USUARIO
exports.editarUsuario = async (req, res) => {
  const id = Number(req.params.id);
  const { nombre, email, rol, edad, celular, colegioId } = req.body;
  try {
    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nombre, email, rol, edad: edad ? Number(edad) : null, celular, colegioId },
      include: { colegio: true }
    });
    res.json({ mensaje: "Usuario actualizado", usuario });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ELIMINAR USUARIO
exports.eliminarUsuario = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.usuario.delete({ where: { id } });
    res.json({ mensaje: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
