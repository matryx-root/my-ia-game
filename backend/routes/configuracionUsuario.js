const express = require('express');
const router = express.Router();
const controller = require('../controllers/configuracionUsuarioController');

// Rutas: /api/configuracion/:usuarioId
router.get('/:usuarioId', controller.obtenerConfiguracion);
router.put('/:usuarioId', controller.guardarConfiguracion);
router.post('/:usuarioId', controller.guardarConfiguracion);
module.exports = router;
