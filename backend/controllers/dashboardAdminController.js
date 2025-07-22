const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

exports.resumenDashboard = async (req, res) => {
  try {
    const [
      totalUsuarios, totalColegios, totalConfiguraciones,
      totalMensajes, totalErrores, totalLogsJuego,
      totalLogsIngreso, totalLogros
    ] = await Promise.all([
      prisma.usuario.count(),
      prisma.colegio.count(),
      prisma.configuracionUsuario.count(),
      prisma.mensajeSoporte.count(),
      prisma.logError.count(),
      prisma.logJuego.count(),
      prisma.logIngreso.count(),
      prisma.achievement.count()
    ]);
    res.json({
      totalUsuarios, totalColegios, totalConfiguraciones,
      totalMensajes, totalErrores, totalLogsJuego,
      totalLogsIngreso, totalLogros
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.usuariosRecientes = async (req, res) => {
  const rows = await prisma.usuario.findMany({
    orderBy: { id: 'desc' }, take: 6,
    include: { colegio: true }
  });
  res.json(rows);
};

exports.colegiosRecientes = async (req, res) => {
  const rows = await prisma.colegio.findMany({
    orderBy: { id: 'desc' }, take: 6
  });
  res.json(rows);
};

exports.configuracionesRecientes = async (req, res) => {
  const rows = await prisma.configuracionUsuario.findMany({
    orderBy: { id: 'desc' }, take: 6,
    include: { usuario: true }
  });
  res.json(rows);
};

exports.mensajesRecientes = async (req, res) => {
  const rows = await prisma.mensajeSoporte.findMany({
    orderBy: { fechaHora: 'desc' }, take: 6,
    include: { usuario: true }
  });
  res.json(rows);
};

exports.erroresRecientes = async (req, res) => {
  const rows = await prisma.logError.findMany({
    orderBy: { fechaHora: 'desc' }, take: 6,
    include: { usuario: true, juego: true }
  });
  res.json(rows);
};

exports.logsJuegoRecientes = async (req, res) => {
  const rows = await prisma.logJuego.findMany({
    orderBy: { fechaHora: 'desc' }, take: 6,
    include: { usuario: true, juego: true }
  });
  res.json(rows);
};

exports.logsIngresoRecientes = async (req, res) => {
  const rows = await prisma.logIngreso.findMany({
    orderBy: { fechaHora: 'desc' }, take: 6,
    include: { usuario: true }
  });
  res.json(rows);
};

exports.logrosRecientes = async (req, res) => {
  const rows = await prisma.achievement.findMany({
    orderBy: { fechaHora: 'desc' }, take: 6,
    include: { usuario: true, juego: true }
  });
  res.json(rows);
};
