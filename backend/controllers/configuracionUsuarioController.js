const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Obtener configuración de usuario (por ID de usuario)
exports.obtenerConfiguracion = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const config = await prisma.configuracionUsuario.findUnique({ where: { usuarioId } });
    if (!config) return res.status(404).json({ error: "Configuración no encontrada" });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nueva configuración
exports.crearConfiguracion = async (req, res) => {
  try {
    const { usuarioId, tema, idioma, sonido, notificaciones } = req.body;
    // Verifica si ya existe
    const existente = await prisma.configuracionUsuario.findUnique({ where: { usuarioId } });
    if (existente) return res.status(400).json({ error: "Configuración ya existe, usa PUT para actualizar" });
    const config = await prisma.configuracionUsuario.create({
      data: { usuarioId, tema, idioma, sonido, notificaciones }
    });
    res.status(201).json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Actualizar configuración
exports.actualizarConfiguracion = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const { tema, idioma, sonido, notificaciones } = req.body;
    const config = await prisma.configuracionUsuario.update({
      where: { usuarioId },
      data: { tema, idioma, sonido, notificaciones }
    });
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
