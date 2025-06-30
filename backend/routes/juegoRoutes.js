// routes/juegoRoutes.js

const express = require('express');
const router = express.Router();
const juegoCtrl = require('../controllers/juegoController');

// --- CRUD de juegos ---
router.get('/', juegoCtrl.listarJuegos);            // GET /api/juegos
router.post('/', juegoCtrl.crearJuego);             // POST /api/juegos
router.put('/:id', juegoCtrl.editarJuego);          // PUT /api/juegos/:id
router.delete('/:id', juegoCtrl.eliminarJuego);     // DELETE /api/juegos/:id

// --- Progreso y logros (guardar/actualizar) ---
router.post('/progreso', juegoCtrl.guardarProgreso);   // POST /api/juegos/progreso
router.post('/logro', juegoCtrl.guardarLogro);         // POST /api/juegos/logro

// --- Consultar progreso y logros por usuario ---
router.get('/progreso/:id', juegoCtrl.progresoUsuario);      // GET /api/juegos/progreso/:id
router.get('/logros/:id', juegoCtrl.logrosUsuario);          // GET /api/juegos/logros/:id
// Asegúrate de que en el controlador exista logrosUsuario (o ajusta el nombre)

module.exports = router;
