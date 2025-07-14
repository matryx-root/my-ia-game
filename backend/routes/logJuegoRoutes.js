const express = require('express');
const router = express.Router();
const logJuegoCtrl = require('../controllers/logJuegoController');

// Registrar un log de juego
router.post('/', logJuegoCtrl.registrarLogJuego);

// Listar todos los logs de juego (para admin)
router.get('/', logJuegoCtrl.listarLogsJuego);

module.exports = router;
