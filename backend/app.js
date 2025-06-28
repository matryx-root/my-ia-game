const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const juegoRoutes = require('./routes/juegoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const colegioRoutes = require('./routes/colegioRoutes'); // Si tienes este archivo
const mensajesRoutes = require('./routes/mensajes');     // Mensajes de soporte

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/usuarios', usuarioRoutes);   // Registro, login, perfil
app.use('/api/juegos', juegoRoutes);       // Juegos, registrar progreso
app.use('/api/admin', adminRoutes);        // Admin y docente
app.use('/api/colegios', colegioRoutes);   // Colegios (si aplica)
app.use('/api/mensajes', mensajesRoutes);  // Mensajes de soporte

// Ruta base de salud
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Manejo global de errores (opcional)
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});

module.exports = app;
