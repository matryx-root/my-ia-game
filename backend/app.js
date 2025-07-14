// backend/app.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// --- Importar rutas principales ---
const usuarioRoutes = require('./routes/usuarioRoutes');                // Registro, login, perfil
const juegoRoutes = require('./routes/juegoRoutes');                    // Juegos, progreso, logros
const adminRoutes = require('./routes/adminRoutes');                    // Admin/docente: usuarios, colegios, progreso
const colegioRoutes = require('./routes/colegioRoutes');                // Gestión de colegios
const mensajesRoutes = require('./routes/mensajes');                    // Mensajes de soporte
const dashboardAdminRoutes = require('./routes/dashboardAdminRoutes');   // Dashboard para admin
const achievementRoutes = require('./routes/achievementRoutes');         // Logros de usuario
const configuracionUsuarioRoutes = require('./routes/configuracionUsuario'); // Configuración usuario
const logJuegoRoutes = require('./routes/logJuegoRoutes');              // Logs de juego
const logErrorRoutes = require('./routes/logErrorRoutes');              // Logs de errores
const juegosAdminRoutes = require('./routes/juegosAdmin');              // CRUD completo de juegos (solo admin, incluye upload/download)

// --- Inicializar Express ---
const app = express();
app.use(express.json());
app.use(cors());

// --- Montar rutas principales (¡Orden importa si hay rutas similares!) ---
app.use('/api/usuarios', usuarioRoutes);            // Registro, login, perfil de usuario
app.use('/api/usuarios/achievement', achievementRoutes); // Logros de usuario
app.use('/api/juegos', juegoRoutes);                // Juegos, progreso, logros
app.use('/api/admin', adminRoutes);                 // Usuarios, colegios, progreso (solo admin/docente)
app.use('/api/admin/juegos', juegosAdminRoutes);    // CRUD de juegos (solo admin, archivos JS)
app.use('/api/colegios', colegioRoutes);            // Colegios
app.use('/api/mensajes', mensajesRoutes);           // Soporte/mensajes
app.use('/api/dashboard', dashboardAdminRoutes);    // Dashboard admin
app.use('/api/configuracion', configuracionUsuarioRoutes); // Configuración usuario
app.use('/api/logs-juego', logJuegoRoutes);         // Logs de juego
app.use('/api/logs-error', logErrorRoutes);         // Logs de errores

// --- Ruta de salud/prueba ---
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// --- Manejo de rutas inexistentes (404) ---
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// --- Manejo global de errores (¡siempre al final!) ---
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
