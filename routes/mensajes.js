const express = require('express');
const router = express.Router();
const mensajeSoporteController = require('../controllers/mensajeSoporteController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, mensajeSoporteController.crearMensaje);


router.get('/', authMiddleware, mensajeSoporteController.listarMensajes);


router.put('/:id/responder', authMiddleware, mensajeSoporteController.responderMensaje);


router.put('/:id/leido', authMiddleware, mensajeSoporteController.marcarLeido);


router.put('/:id/editar', authMiddleware, mensajeSoporteController.editarMensaje);


router.delete('/:id', authMiddleware,  mensajeSoporteController.eliminarMensaje);

module.exports = router;
