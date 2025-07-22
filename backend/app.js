const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

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

// Configuración de middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configuración CORS optimizada
const corsOptions = {
  origin: [
    'https://my-ia-game-app.herokuapp.com',
    'http://localhost:3000'
  ],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// Middleware de logs para desarrollo
if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Configuración de rutas API
const apiRoutes = express.Router();
apiRoutes.use('/usuarios', usuarioRoutes);
apiRoutes.use('/usuarios/achievement', achievementRoutes);
apiRoutes.use('/juegos', juegoRoutes);
apiRoutes.use('/admin', adminRoutes);
apiRoutes.use('/admin/juegos', juegosAdminRoutes);
apiRoutes.use('/colegios', colegioRoutes);
apiRoutes.use('/mensajes', mensajesRoutes);
apiRoutes.use('/dashboard', dashboardAdminRoutes);
apiRoutes.use('/configuracion', configuracionUsuarioRoutes);
apiRoutes.use('/logs-juego', logJuegoRoutes);
apiRoutes.use('/logs-error', logErrorRoutes);

// Prefijo /api para todas las rutas
app.use('/api', apiRoutes);

// Ruta de verificación de salud
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    error: 'Ruta API no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Configuración para servir el frontend en producción
const frontendPath = path.join(__dirname, 'frontend', 'build');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendPath));
  
  // Captura todas las rutas no-API para el frontend
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send(`
      <h1>API en desarrollo</h1>
      <p>Endpoints disponibles:</p>
      <ul>
        <li><a href="/api/health">/api/health</a> - Verificar estado</li>
        <li>/api/colegios - Gestión de colegios</li>
        <li>/api/usuarios - Gestión de usuarios</li>
      </ul>
    `);
  });
}

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error('Error global:', {
    message: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
    path: req.path,
    method: req.method
  });

  const response = {
    error: process.env.NODE_ENV !== 'production' 
      ? err.message 
      : 'Error interno del servidor'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(err.status || 500).json(response);
});

module.exports = app;