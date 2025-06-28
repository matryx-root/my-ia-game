const express = require('express');
const router = express.Router();
const juegoCtrl = require('../controllers/juegoController');
const { authMiddleware } = require('../middlewares/auth');

// Listar todos los juegos (requiere autenticación)
router.get('/', authMiddleware, juegoCtrl.listarJuegos);

// Registrar el progreso del usuario en un juego (requiere autenticación)
router.post('/registrar-progreso', authMiddleware, juegoCtrl.registrarProgreso);

// [Opcional] Aquí puedes agregar más endpoints específicos de juegos, ejemplo:
// router.post('/', authMiddleware, juegoCtrl.crearJuego);
// router.put('/:id', authMiddleware, juegoCtrl.editarJuego);
// router.delete('/:id', authMiddleware, juegoCtrl.eliminarJuego);

module.exports = router;
