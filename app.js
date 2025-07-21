const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const juegoRoutes = require('./routes/juegoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const colegioRoutes = require('./routes/colegioRoutes');
const mensajesRoutes = require('./routes/mensajes');
const dashboardAdminRoutes = require('./routes/dashboardAdminRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const configuracionUsuarioRoutes = require('./routes/configuracionUsuario');
const logJuegoRoutes = require('./routes/logJuegoRoutes');
const logErrorRoutes = require('./routes/logErrorRoutes');
const juegosAdminRoutes = require('./routes/juegosAdmin');

const app = express();

// Middlewares globales
app.use(express.json());
app.use(cors());

// Rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuarios/achievement', achievementRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/admin/juegos', juegosAdminRoutes);
app.use('/api/colegios', colegioRoutes);
app.use('/api/mensajes', mensajesRoutes);
app.use('/api/dashboard', dashboardAdminRoutes);
app.use('/api/configuracion', configuracionUsuarioRoutes);
app.use('/api/logs-juego', logJuegoRoutes);
app.use('/api/logs-error', logErrorRoutes);

// Servir React build en producción
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, 'frontend', 'build');
  app.use(express.static(frontendBuildPath));

  // Todas las rutas no API envían index.html para que React maneje el routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Ruta simple para desarrollo o cuando no está build React
  app.get('/', (req, res) => {
    res.send('✅ API funcionando correctamente');
  });
}

// 404 - Ruta no encontrada para APIs
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: '❌ Ruta API no encontrada' });
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
