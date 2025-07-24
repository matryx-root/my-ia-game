const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');



exports.obtenerConfiguracion = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId);
    const config = await prisma.configuracionUsuario.findUnique({
      where: { usuarioId }
    });
    res.json(config || {});
  } catch (err) {
    console.error('Error obteniendo configuración:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

exports.guardarConfiguracion = async (req, res) => {
  try {
    const usuarioId = parseInt(req.params.usuarioId || req.body.usuarioId);
    const { tema, idioma, sonido, notificaciones } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ error: 'ID de usuario requerido' });
    }

    const config = await prisma.configuracionUsuario.upsert({
      where: { usuarioId },
      update: { tema, idioma, sonido, notificaciones },
      create: { usuarioId, tema, idioma, sonido, notificaciones }
    });

    res.json(config);
  } catch (err) {
    console.error('Error guardando configuración:', err);
    res.status(400).json({ error: 'No se pudo guardar la configuración' });
  }
};