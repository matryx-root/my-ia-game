const express = require('express');
const router = express.Router();
const juegoCtrl = require('../controllers/juegoController');

router.get('/juegos', juegoCtrl.listarJuegos);
router.get('/juegos/:id/preguntas', juegoCtrl.preguntasPorJuego);

module.exports = router;
