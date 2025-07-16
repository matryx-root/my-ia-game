const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

const { authMiddleware } = require('../middlewares/auth');


router.post('/register', usuarioController.registrar);


router.post('/login', usuarioController.login);


router.get('/perfil/:id',  usuarioController.verPerfil);
router.get('/perfil/me', authMiddleware, usuarioController.perfilMe);

module.exports = router;
