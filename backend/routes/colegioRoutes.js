const express = require('express');
const router = express.Router();
const colegioCtrl = require('../controllers/colegioController');
const { authMiddleware } = require('../middlewares/auth');

// GET público para listar todos los colegios
router.get('/', colegioCtrl.listarColegios);
// POST (solo para admin o protegida, si quieres crear)
router.post('/', authMiddleware, colegioCtrl.crearColegio);

module.exports = router;
