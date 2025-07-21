const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/auth');


router.use(authMiddleware); 

router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios', adminController.crearUsuario);
router.put('/usuarios/:id', adminController.editarUsuario);
router.delete('/usuarios/:id', adminController.eliminarUsuario);


router.get('/juegos', adminController.listarJuegos);
router.post('/juegos', adminController.crearJuego);
router.put('/juegos/:id', adminController.editarJuego);
router.delete('/juegos/:id', adminController.eliminarJuego);


router.get('/progreso-usuario/:id', adminController.progresoUsuario);

router.get('/usuarios', adminController.listarUsuarios);
router.get('/colegios', adminController.listarColegios);
module.exports = router;

