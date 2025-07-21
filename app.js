require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importación de rutas
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

// Configuración básica
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors());

// Configuración para servir archivos estáticos
app.use('/static', express.static(path.join(__dirname, 'frontend/build/static')));
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Middleware para log de peticiones
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

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

// Ruta para verificar estado del servidor
app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// 404 para APIs no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: '❌ Ruta API no encontrada' });
});

// Servir aplicación React para todas las demás rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Manejo global de errores
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.stack);
  
  // Registrar error en base de datos si es necesario
  // ...
  
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Error interno del servidor' 
      : err.message 
  });
});

module.exports = app;