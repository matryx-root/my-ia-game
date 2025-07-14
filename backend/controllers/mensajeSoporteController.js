const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CONFIGURACIÓN DE VALIDACIÓN
const MIN_MSG_LEN = 10;
const MAX_MSG_LEN = 100;
const MAX_RESPUESTA_LEN = 100;
const SOLO_TEXTO_VALIDO = /^[A-ZÁÉÍÓÚÑ0-9 ]+$/; // Solo mayúsculas, números, espacios

// Crear un mensaje de soporte
exports.crearMensaje = async (req, res) => {
  try {
    const { usuarioId, mensaje } = req.body;
    let texto = (mensaje || "").trim().toUpperCase();

    // Valida usuario destino
    const usuario = await prisma.usuario.findUnique({ where: { id: Number(usuarioId) } });
    if (!usuario) {
      return res.status(400).json({ error: "Usuario destino no existe" });
    }
    if (!texto || texto.length < MIN_MSG_LEN) {
      return res.status(400).json({ error: `El mensaje debe tener al menos ${MIN_MSG_LEN} caracteres.` });
    }
    if (texto.length > MAX_MSG_LEN) {
      return res.status(400).json({ error: `El mensaje no puede superar ${MAX_MSG_LEN} caracteres.` });
    }
    if (!SOLO_TEXTO_VALIDO.test(texto)) {
      return res.status(400).json({ error: "Solo MAYÚSCULAS, números y espacios. No se permiten símbolos, tildes ni signos." });
    }

    // Crea mensaje
    const nuevoMensaje = await prisma.mensajeSoporte.create({
      data: { usuarioId: Number(usuarioId), mensaje: texto }
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
    let texto = (respuesta || "").trim().toUpperCase();

    // Validar contenido
    if (!texto || texto.length < MIN_MSG_LEN) {
      return res.status(400).json({ error: `La respuesta debe tener al menos ${MIN_MSG_LEN} caracteres.` });
    }
    if (texto.length > MAX_RESPUESTA_LEN) {
      return res.status(400).json({ error: `La respuesta no puede superar ${MAX_RESPUESTA_LEN} caracteres.` });
    }
    if (!SOLO_TEXTO_VALIDO.test(texto)) {
      return res.status(400).json({ error: "Solo MAYÚSCULAS, números y espacios. No se permiten símbolos, tildes ni signos." });
    }

    // Evita doble respuesta
    const mensaje = await prisma.mensajeSoporte.findUnique({ where: { id } });
    if (!mensaje) return res.status(404).json({ error: "Mensaje no encontrado" });
    if (mensaje.estado === "respondido") {
      return res.status(400).json({ error: "El mensaje ya fue respondido." });
    }

    const actualizado = await prisma.mensajeSoporte.update({
      where: { id },
      data: { respuesta: texto, estado }
    });
    res.json({ mensaje: "Mensaje respondido", mensaje: actualizado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// EDITAR mensaje (solo admin, por id)
exports.editarMensaje = async (req, res) => {
  try {
    const id = Number(req.params.id);
    let { mensaje } = req.body;
    mensaje = (mensaje || "").trim().toUpperCase();

    if (!mensaje || mensaje.length < MIN_MSG_LEN) {
      return res.status(400).json({ error: `El mensaje debe tener al menos ${MIN_MSG_LEN} caracteres.` });
    }
    if (mensaje.length > MAX_MSG_LEN) {
      return res.status(400).json({ error: `El mensaje no puede superar ${MAX_MSG_LEN} caracteres.` });
    }
    if (!SOLO_TEXTO_VALIDO.test(mensaje)) {
      return res.status(400).json({ error: "Solo MAYÚSCULAS, números y espacios. No se permiten símbolos, tildes ni signos." });
    }
    const actualizado = await prisma.mensajeSoporte.update({
      where: { id },
      data: { mensaje }
    });
    res.json({ mensaje: "Mensaje editado", mensaje: actualizado });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ELIMINAR mensaje (solo admin, por id)
exports.eliminarMensaje = async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.mensajeSoporte.delete({ where: { id } });
    res.json({ mensaje: "Mensaje eliminado" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Marcar mensaje como leído (solo usuario destinatario)
exports.marcarLeido = async (req, res) => {
  try {
    const id = Number(req.params.id);

    // Valida existencia del mensaje
    const mensaje = await prisma.mensajeSoporte.findUnique({ where: { id } });
    if (!mensaje) return res.status(404).json({ error: "Mensaje no encontrado" });

    // Opcional: valida si req.user.id === mensaje.usuarioId para mayor seguridad
    // if (req.user && req.user.id !== mensaje.usuarioId) {
    //   return res.status(403).json({ error: "No autorizado para marcar como leído." });
    // }

    const actualizado = await prisma.mensajeSoporte.update({
      where: { id },
      data: { leido: true, estado: "leido" }
    });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
