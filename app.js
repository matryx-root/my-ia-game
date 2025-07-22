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
const cors = require('cors');
app.use(cors({
  origin: [
    'https://my-ia-game-app.herokuapp.com',
    'http://localhost:3000'
  ],
  credentials: true
}));

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

// 404 para APIs no encontradas (antes del catch-all React)
//app.use('/api/*', (req, res) => {
//  res.status(404).json({ error: '❌ Ruta API no encontrada' });
//});

// Servir React build en producción
if (process.env.NODE_ENV === 'production') {
  const frontendBuildPath = path.join(__dirname, './frontend', 'build');
  app.use(express.static(frontendBuildPath));

  // React SPA para todas las demás rutas (no API)
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendBuildPath, 'index.html'));
  });
} else {
  // Modo desarrollo simple
  app.get('/', (req, res) => {
    res.send('✅ API funcionando correctamente');
  });
}

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test API funciona' });
});

module.exports = app;
