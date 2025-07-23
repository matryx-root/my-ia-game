require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');

app.use(cors({
  origin: 'https://my-ia-game-app.herokuapp.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));
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




// Middleware para parsear JSON y URL encoded con límite alto para payloads grandes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck simple para verificar que el backend esté activo
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Middleware de logs para desarrollo
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Rutas API agrupadas con prefijo /api
const apiRoutes = express.Router();

apiRoutes.use('/usuarios', usuarioRoutes);
apiRoutes.use('/achievements', achievementRoutes);
apiRoutes.use('/juegos', juegoRoutes);
apiRoutes.use('/admin', adminRoutes);
apiRoutes.use('/admin/juegos', juegosAdminRoutes);
apiRoutes.use('/colegios', colegioRoutes);
apiRoutes.use('/mensajes', mensajesRoutes);
apiRoutes.use('/dashboard', dashboardAdminRoutes);
apiRoutes.use('/configuracion', configuracionUsuarioRoutes);
apiRoutes.use('/logs-juego', logJuegoRoutes);
apiRoutes.use('/logs-error', logErrorRoutes);

app.use('/api', apiRoutes);

// Manejo de rutas API no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Ruta API no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Servir frontend React estático en producción
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(frontendPath));

  // Capturar todas las rutas que no son API y enviar index.html para SPA React
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  // En desarrollo, mostrar un mensaje simple en la raíz
  app.get('/', (req, res) => {
    res.send(`
      <h1>API en desarrollo</h1>
      <p>Endpoints disponibles:</p>
      <ul>
        <li><a href="/api/health">/api/health</a> - Verificar estado</li>
        <li>/api/colegios - Gestión de colegios</li>
        <li>/api/usuarios - Gestión de usuarios</li>
        <!-- agrega más endpoints según tu API -->
      </ul>
    `);
  });
}

// Middleware centralizado para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error global:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  const response = {
    error: process.env.NODE_ENV !== 'production' ? err.message : 'Error interno del servidor'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(err.status || 500).json(response);
});

module.exports = app;
