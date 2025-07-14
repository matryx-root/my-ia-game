const express = require('express');
const router = express.Router();
const mensajeSoporteController = require('../controllers/mensajeSoporteController');
const { authMiddleware } = require('../middlewares/auth');
// const { isAdminMiddleware } = require('../middlewares/isAdmin'); // Si lo tienes, agrégalo

// Crear mensaje de soporte (alumno o docente)
router.post('/', authMiddleware, mensajeSoporteController.crearMensaje);

// Listar mensajes (alumno solo ve los suyos, docente/admin puede ver todos)
router.get('/', authMiddleware, mensajeSoporteController.listarMensajes);

// Responder mensaje (solo docente o admin)
router.put('/:id/responder', authMiddleware, mensajeSoporteController.responderMensaje);

// Marcar como leído
router.put('/:id/leido', authMiddleware, mensajeSoporteController.marcarLeido);

// Editar mensaje (solo admin, agregar isAdminMiddleware si tienes uno)
router.put('/:id/editar', authMiddleware, /*isAdminMiddleware,*/ mensajeSoporteController.editarMensaje);

// Eliminar mensaje (solo admin)
router.delete('/:id', authMiddleware, /*isAdminMiddleware,*/ mensajeSoporteController.eliminarMensaje);

module.exports = router;
