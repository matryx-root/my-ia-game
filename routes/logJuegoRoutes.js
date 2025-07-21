const express = require('express');
const router = express.Router();
const logJuegoCtrl = require('../controllers/logJuegoController');


router.post('/', logJuegoCtrl.registrarLogJuego);


router.get('/', logJuegoCtrl.listarLogsJuego);

module.exports = router;
