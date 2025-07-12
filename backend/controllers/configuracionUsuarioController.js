const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET: Obtener configuración de usuario (por ID de usuario)
exports.obtenerConfiguracion = async (req, res) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const config = await prisma.configuracionUsuario.findUnique({ where: { usuarioId } });
    // Devuelve objeto vacío en vez de error 404 para mejor experiencia frontend
    res.json(config || {}); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPSERT: Crear o actualizar configuración (POST/PUT)
exports.guardarConfiguracion = async (req, res) => {
  try {
    // Prioriza el usuarioId de URL (params) o del body
    const usuarioId = Number(req.params.usuarioId || req.body.usuarioId);
    const { tema, idioma, sonido, notificaciones } = req.body;
    // Upsert: si existe, actualiza; si no, crea
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
