const express = require('express');
const router = express.Router();
const controller = require('../controllers/configuracionUsuarioController');


router.get('/:usuarioId', controller.obtenerConfiguracion);

router.post('/:usuarioId', controller.guardarConfiguracion);
router.put('/:usuarioId', controller.guardarConfiguracion);

module.exports = router;
