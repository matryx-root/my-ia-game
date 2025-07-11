const express = require('express');
const router = express.Router();
const configCtrl = require('../controllers/configuracionUsuarioController');

// GET configuración por usuario
router.get('/:usuarioId', configCtrl.obtenerConfiguracion);

// POST nueva configuración
router.post('/', configCtrl.crearConfiguracion);

// PUT actualizar configuración
router.put('/:usuarioId', configCtrl.actualizarConfiguracion);

module.exports = router;
