const express = require('express');
const router = express.Router();
const mensajeSoporteController = require('../controllers/mensajeSoporteController');
const { authMiddleware } = require('../middlewares/auth');

// Crear mensaje de soporte (alumno o docente)
router.post('/', authMiddleware, mensajeSoporteController.crearMensaje);

// Listar mensajes (alumno solo ve los suyos, docente/admin puede ver todos)
router.get('/', authMiddleware, mensajeSoporteController.listarMensajes);

// Responder mensaje (solo docente o admin)
router.put('/:id/responder', authMiddleware, mensajeSoporteController.responderMensaje);

module.exports = router;
