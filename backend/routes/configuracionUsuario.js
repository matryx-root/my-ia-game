const express = require('express');
const router = express.Router();
const controller = require('../controllers/configuracionUsuarioController');

// GET config
router.get('/:usuarioId', controller.obtenerConfiguracion);
// POST y PUT hacen lo mismo: UPSERT (crear si no existe, actualizar si existe)
router.post('/:usuarioId', controller.guardarConfiguracion);
router.put('/:usuarioId', controller.guardarConfiguracion);

module.exports = router;
