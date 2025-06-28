const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');
const { authMiddleware } = require('../middlewares/auth');

// Registro de usuario (alumno o docente)
router.post('/register', usuarioCtrl.registrar);

// Login
router.post('/login', usuarioCtrl.login);

// Ver perfil propio (recomendado proteger)
router.get('/perfil/:id', authMiddleware, usuarioCtrl.verPerfil);

module.exports = router;
