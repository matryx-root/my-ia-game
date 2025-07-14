const express = require('express');
const router = express.Router();
const logErrorCtrl = require('../controllers/logErrorController');

// Registrar un nuevo error
router.post('/', logErrorCtrl.crearLogError);

// Listar errores (opcional: filtrar por juego o usuario)
router.get('/', logErrorCtrl.listarLogErrores);

// Obtener detalles de un error específico (opcional)
router.get('/:id', logErrorCtrl.obtenerLogErrorPorId);

// Eliminar un log de error (opcional)
router.delete('/:id', logErrorCtrl.eliminarLogError);

module.exports = router;
