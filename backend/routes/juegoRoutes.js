const express = require('express');
const router = express.Router();
const juegoCtrl = require('../controllers/juegoController');

router.get('/juegos', juegoCtrl.listarJuegos);
//router.get('/juegos/:id/preguntas', juegoCtrl.preguntasPorJuego);  // ← ESTA FUNCIÓN NO EXISTE
router.post('/registrar-progreso', juegoCtrl.registrarProgreso);


module.exports = router;
