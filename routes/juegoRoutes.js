

const express = require('express');
const router = express.Router();
const juegoCtrl = require('../controllers/juegoController');


router.get('/', juegoCtrl.listarJuegos);            
router.post('/', juegoCtrl.crearJuego);            
router.put('/:id', juegoCtrl.editarJuego);          
router.delete('/:id', juegoCtrl.eliminarJuego);     


router.post('/progreso', juegoCtrl.guardarProgreso);   
router.post('/logro', juegoCtrl.guardarLogro);         


router.get('/progreso/:id', juegoCtrl.progresoUsuario);      
router.get('/logros/:id', juegoCtrl.logrosUsuario);          

module.exports = router;
