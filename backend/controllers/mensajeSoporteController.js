const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un mensaje de soporte
exports.crearMensaje = async (req, res) => {
  try {
    const { usuarioId, mensaje } = req.body;
    const nuevoMensaje = await prisma.mensajeSoporte.create({
      data: { usuarioId, mensaje }
    });
    res.status(201).json(nuevoMensaje);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar mensajes de soporte (puede filtrar por usuarioId)
exports.listarMensajes = async (req, res) => {
  const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : undefined;
  try {
    const mensajes = await prisma.mensajeSoporte.findMany({
      where: usuarioId ? { usuarioId } : {},
      orderBy: { fechaHora: 'desc' }
    });
    res.json(mensajes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Responder mensaje de soporte (solo docente o admin)
exports.responderMensaje = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { respuesta, estado = "respondido" } = req.body;
    const mensaje = await prisma.mensajeSoporte.update({
      where: { id },
      data: { respuesta, estado }
    });
    res.json({ mensaje: "Mensaje respondido", mensaje });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
