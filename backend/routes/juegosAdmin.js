const express = require('express');
const router = express.Router();
const juegosCtrl = require('../controllers/juegoAdminController');
const multer = require('multer');
const upload = multer({ dest: 'games/' });
const { adminOnlyMiddleware } = require('../middlewares/auth');

// CRUD Juegos (solo admin)
router.get('/', adminOnlyMiddleware, juegosCtrl.getAll);
router.post('/', adminOnlyMiddleware, juegosCtrl.create);
router.put('/:id', adminOnlyMiddleware, juegosCtrl.update);
router.delete('/:id', adminOnlyMiddleware, juegosCtrl.delete);

// Subida y descarga de archivo
router.post('/upload', adminOnlyMiddleware, upload.single('archivo'), juegosCtrl.uploadArchivo);
router.get('/download/:archivo', adminOnlyMiddleware, juegosCtrl.downloadArchivo);

module.exports = router;
