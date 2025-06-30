const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
// Si tienes middlewares de autenticación:
const { authMiddleware } = require('../middlewares/auth');

// Registro de usuario (alumno o docente)
router.post('/register', usuarioController.registrar);

// Login
router.post('/login', usuarioController.login);

// Ver perfil propio (recomendado proteger con middleware si es necesario)
router.get('/perfil/:id', /* authMiddleware, */ usuarioController.verPerfil);
router.get('/perfil/me', authMiddleware, usuarioController.perfilMe);
// Puedes agregar más rutas aquí:
// router.get('/listar', usuarioController.listarUsuarios);
// router.put('/editar/:id', usuarioController.editarUsuario);
// router.delete('/eliminar/:id', usuarioController.eliminarUsuario);

module.exports = router;
