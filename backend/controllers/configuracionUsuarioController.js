const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');


exports.obtenerConfiguracion = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const config = await prisma.configuracionUsuario.findUnique({ where: { usuarioId } });
    
    res.json(config || {}); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.guardarConfiguracion = async (req, res) => {
  try {
    
    const usuarioId = Number(req.params.usuarioId || req.body.usuarioId);
    const { tema, idioma, sonido, notificaciones } = req.body;
    
    const config = await prisma.configuracionUsuario.upsert({
      where: { usuarioId },
      update: { tema, idioma, sonido, notificaciones },
      create: { usuarioId, tema, idioma, sonido, notificaciones }
    });
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};