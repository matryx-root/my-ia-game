const express = require('express');
const router = express.Router();
const juegosCtrl = require('../controllers/juegoAdminController');
const multer = require('multer');
const path = require('path');

// === Ruta absoluta a /frontend/src/games ===
const gamesPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'games');

// === Multer configurado para .js y path correcto ===
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, gamesPath);
    },
    filename: (req, file, cb) => {
      // Guarda con el nombre original del archivo
      cb(null, file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
    // Solo permite archivos .js
    if (path.extname(file.originalname).toLowerCase() === '.js') cb(null, true);
    else cb(new Error('Solo se permiten archivos .js'));
  }
});

const { adminOnlyMiddleware } = require('../middlewares/auth');

// ===== CRUD de Juegos (solo admin) =====
router.get('/', adminOnlyMiddleware, juegosCtrl.getAll);
router.post('/', adminOnlyMiddleware, juegosCtrl.create);
router.put('/:id', adminOnlyMiddleware, juegosCtrl.update);
router.delete('/:id', adminOnlyMiddleware, juegosCtrl.delete);

// ===== Subida de archivo .js =====
router.post('/upload', adminOnlyMiddleware, upload.single('archivo'), juegosCtrl.uploadArchivo);

// ===== Descarga de archivo .js =====
router.get('/download/:archivo', adminOnlyMiddleware, juegosCtrl.downloadArchivo);

module.exports = router;
