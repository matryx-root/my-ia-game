const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { authMiddleware } = require('../middlewares/auth');


router.get('/:usuarioId', achievementController.listarAchievementsUsuario);
router.post('/', authMiddleware, achievementController.crearAchievement);
module.exports = router;
