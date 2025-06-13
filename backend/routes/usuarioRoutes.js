const express = require('express');
const router = express.Router();
const usuarioCtrl = require('../controllers/usuarioController');

router.post('/register', usuarioCtrl.registrar);
router.post('/login', usuarioCtrl.login);
router.get('/perfil/:id', usuarioCtrl.verPerfil);

module.exports = router;
