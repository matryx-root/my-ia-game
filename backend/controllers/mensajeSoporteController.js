const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Crear un mensaje de soporte
// controllers/mensajeSoporteController.js

exports.crearMensaje = async (req, res) => {
  try {
    const { usuarioId, mensaje } = req.body;

    // Valida que usuarioId sea válido (exista ese usuario)
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    if (!usuario) {
      return res.status(400).json({ error: "Usuario destino no existe" });
    }
    if (!mensaje || !mensaje.trim()) {
      return res.status(400).json({ error: "Mensaje vacío" });
    }

    // Crea mensaje a ese usuario
    const nuevoMensaje = await prisma.mensajeSoporte.create({
      data: { usuarioId: Number(usuarioId), mensaje }
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
      orderBy: { fechaHora: 'desc' },
      include: {
        usuario: {
          select: {
            nombre: true,
            rol: true,
            colegio: { select: { nombre: true } }
          }
        }
      }
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

// Marcar mensaje como leído (solo usuario destinatario)
exports.marcarLeido = async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Valida si el mensaje pertenece al usuario autenticado
    const mensaje = await prisma.mensajeSoporte.findUnique({ where: { id } });
    if (!mensaje) return res.status(404).json({ error: "Mensaje no encontrado" });
    // Opcional: valida si req.user.id === mensaje.usuarioId

    const actualizado = await prisma.mensajeSoporte.update({
      where: { id },
      data: { leido: true, estado: "leido" }
    });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
