const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware } = require('../middlewares/auth');

// PROTEGER TODAS LAS RUTAS: Solo docentes pueden acceder (ajusta si tienes admin)
router.use(authMiddleware); // Si quieres agregar validación de rol, agrégala aquí

// Usuarios (gestión por docente)
router.get('/usuarios', adminController.listarUsuarios);
router.post('/usuarios', adminController.crearUsuario);
router.put('/usuarios/:id', adminController.editarUsuario);
router.delete('/usuarios/:id', adminController.eliminarUsuario);

// Juegos
router.get('/juegos', adminController.listarJuegos);
router.post('/juegos', adminController.crearJuego);
router.put('/juegos/:id', adminController.editarJuego);
router.delete('/juegos/:id', adminController.eliminarJuego);

// Progreso de un usuario (por id)
router.get('/progreso-usuario/:id', adminController.progresoUsuario);
// routes/adminRoutes.js (o similar)
router.get('/usuarios', adminController.listarUsuarios);
router.get('/colegios', adminController.listarColegios);
module.exports = router;

