const express = require('express');
const router = express.Router();
const logErrorCtrl = require('../controllers/logErrorController');


router.post('/', logErrorCtrl.crearLogError);


router.get('/', logErrorCtrl.listarLogErrores);


router.get('/:id', logErrorCtrl.obtenerLogErrorPorId);


router.delete('/:id', logErrorCtrl.eliminarLogError);

module.exports = router;
