const express = require('express');
const router = express.Router();
const achievementController = require('../controllers/achievementController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, achievementController.crearAchievement);
router.get('/achievements', achievementController.listarAchievementsUsuario);

module.exports = router;
