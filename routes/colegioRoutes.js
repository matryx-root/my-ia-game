const express = require('express');
const router = express.Router();
const colegioCtrl = require('../controllers/colegioController');
const { authMiddleware } = require('../middlewares/auth');


router.get('/', colegioCtrl.listarColegios);

router.post('/', authMiddleware, colegioCtrl.crearColegio);

module.exports = router;
