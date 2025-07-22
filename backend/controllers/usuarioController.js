const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

exports.registrar = async (req, res) => {
  const { nombre, email, password, edad, celular, rol, colegioId } = req.body;
  try {
    const emailNorm = email.trim().toLowerCase();
    
    const existe = await prisma.usuario.findUnique({ where: { email: emailNorm } });
    if (existe) {
      return res.status(400).json({ error: "El correo ya está registrado. Usa otro correo." });
    }

    const hashed = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email: emailNorm,
        password: hashed,
        rol, 
        colegioId: colegioId ? Number(colegioId) : null,
        edad: edad ? Number(edad) : null,
        celular
      },
      include: { colegio: true }
    });
    res.status(201).json({ mensaje: "Usuario registrado", usuario });
  } catch (err) {
    
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return res.status(400).json({ error: "El correo ya está registrado. Usa otro correo." });
    }
    res.status(400).json({ error: err.message });
  }
};


exports.login = async (req, res) => {
  
  const emailNorm = req.body.email?.trim().toLowerCase();
  const { password } = req.body;

  try {
   
    const user = await prisma.usuario.findUnique({
      where: { email: emailNorm },
      include: { colegio: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'correo_no_existe' });
    }

    
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'password_incorrecta' });
    }

    
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


exports.listarUsuarios = async (req, res) => {
  let where = {};
  if (req.user?.rol === "docente") {
    where = { rol: "alumno", colegioId: req.user.colegioId };
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


exports.verPerfil = async (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: "Falta id de usuario" });
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { id },
      include: { colegio: true, configuracion: true }
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.editarUsuario = async (req, res) => {
  const id = Number(req.params.id);
  let { nombre, email, rol, edad, celular, colegioId } = req.body;
  try {
    
    if (email) {
      email = email.trim().toLowerCase();
      const existe = await prisma.usuario.findFirst({
        where: { email, NOT: { id } }
      });
      if (existe) {
        return res.status(400).json({ error: "El correo ya está registrado por otro usuario." });
      }
    }

    const usuario = await prisma.usuario.update({
      where: { id },
      data: { nombre, email, rol, edad: edad ? Number(edad) : null, celular, colegioId },
      include: { colegio: true }
    });
    res.json({ mensaje: "Usuario actualizado", usuario });
  } catch (err) {
    if (err.code === "P2002" && err.meta?.target?.includes("email")) {
      return res.status(400).json({ error: "El correo ya está registrado por otro usuario." });
    }
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
