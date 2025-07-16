const express = require('express');
const router = express.Router();
const dashboardAdminController = require('../controllers/dashboardAdminController');
const { authMiddleware } = require('../middlewares/auth');


router.use(authMiddleware);


router.get('/resumen', dashboardAdminController.resumenDashboard);


router.get('/usuarios', dashboardAdminController.usuariosRecientes);
router.get('/colegios', dashboardAdminController.colegiosRecientes);
router.get('/configuraciones', dashboardAdminController.configuracionesRecientes);
router.get('/mensajes', dashboardAdminController.mensajesRecientes);
router.get('/errores', dashboardAdminController.erroresRecientes);
router.get('/logsJuego', dashboardAdminController.logsJuegoRecientes);
router.get('/logsIngreso', dashboardAdminController.logsIngresoRecientes);
router.get('/logros', dashboardAdminController.logrosRecientes); 

module.exports = router;
