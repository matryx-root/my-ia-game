const express = require('express');
const router = express.Router();
const juegoCtrl = require('../controllers/juegoController'); // O el nombre que tengas

router.get('/juegos', juegoCtrl.listarJuegos);
router.post('/juegos', juegoCtrl.crearJuego);
router.put('/juegos/:id', juegoCtrl.editarJuego);
router.delete('/juegos/:id', juegoCtrl.eliminarJuego);

// Nuevo: progreso y logros
router.post('/juegos/progreso', juegoCtrl.guardarProgreso);
router.post('/juegos/logro', juegoCtrl.guardarLogro);

module.exports = router;
