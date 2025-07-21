const express = require('express');
const router = express.Router();
const juegosCtrl = require('../controllers/juegoAdminController');
const multer = require('multer');
const path = require('path');


const gamesPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'games');


const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, gamesPath);
    },
    filename: (req, file, cb) => {
    
      cb(null, file.originalname);
    }
  }),
  fileFilter: (req, file, cb) => {
   
    if (path.extname(file.originalname).toLowerCase() === '.js') cb(null, true);
    else cb(new Error('Solo se permiten archivos .js'));
  }
});

const { adminOnlyMiddleware } = require('../middlewares/auth');


router.get('/', adminOnlyMiddleware, juegosCtrl.getAll);
router.post('/', adminOnlyMiddleware, juegosCtrl.create);
router.put('/:id', adminOnlyMiddleware, juegosCtrl.update);
router.delete('/:id', adminOnlyMiddleware, juegosCtrl.delete);


router.post('/upload', adminOnlyMiddleware, upload.single('archivo'), juegosCtrl.uploadArchivo);


router.get('/download/:archivo', adminOnlyMiddleware, juegosCtrl.downloadArchivo);

module.exports = router;
