const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro usuario (usuario común)
exports.registrar = async (req, res) => {
  const { nombre, email, password, edad, celular } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 10);
    const usuario = await prisma.usuario.create({
      data: {
        nombre,
        email,
        password: hashed,
        rol: 'usuario',
        edad: edad ? Number(edad) : null,
        celular
      }
    });
    res.status(201).json({ mensaje: "Usuario registrado", usuario });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ mensaje: 'No existe usuario' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ mensaje: 'Contraseña incorrecta' });

    // Puedes agregar aquí registro de LogIngreso

    const token = jwt.sign({ id: user.id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, usuario: user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Ver perfil
exports.verPerfil = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const usuario = await prisma.usuario.findUnique({
      where: { id }
    });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
