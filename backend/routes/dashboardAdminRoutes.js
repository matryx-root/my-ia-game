const express = require('express');
const router = express.Router();
const dashboardAdminController = require('../controllers/dashboardAdminController');
const { authMiddleware } = require('../middlewares/auth');

// Todas protegidas, solo admin
router.use(authMiddleware);

// Resumen total (widgets)
router.get('/resumen', dashboardAdminController.resumenDashboard);

// Listados recientes (opcional)
router.get('/usuarios', dashboardAdminController.usuariosRecientes);
router.get('/colegios', dashboardAdminController.colegiosRecientes);
router.get('/configuraciones', dashboardAdminController.configuracionesRecientes);
router.get('/mensajes', dashboardAdminController.mensajesRecientes);
router.get('/errores', dashboardAdminController.erroresRecientes);
router.get('/logsJuego', dashboardAdminController.logsJuegoRecientes);
router.get('/logsIngreso', dashboardAdminController.logsIngresoRecientes);
router.get('/logros', dashboardAdminController.logrosRecientes); // Achievement

module.exports = router;
