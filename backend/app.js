const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const usuarioRoutes = require('./routes/usuarioRoutes');
const juegoRoutes = require('./routes/juegoRoutes');
const adminRoutes = require('./routes/adminRoutes');
const colegioRoutes = require('./routes/colegioRoutes');
const mensajesRoutes = require('./routes/mensajes');
const dashboardAdminRoutes = require('./routes/dashboardAdminRoutes'); // <--- Nuevo
const achievementRoutes = require('./routes/achievementRoutes');
const configuracionUsuarioRoutes = require('./routes/configuracionUsuario'); // <--- NUEVO

// Inicializar la app
const app = express();
app.use(express.json());

// Middlewares globales
app.use(cors());

// Montar rutas principales
app.use('/api/usuarios', usuarioRoutes);    // Usuarios: registro, login, perfil
app.use('/api/juegos', juegoRoutes);        // Juegos, progreso, logros
app.use('/api/admin', adminRoutes);         // Admin/docente: usuarios, colegios, progreso
app.use('/api/colegios', colegioRoutes);    // Gestión de colegios
app.use('/api/mensajes', mensajesRoutes);   // Mensajes de soporte
app.use('/api/dashboard', dashboardAdminRoutes); // Dashboard para admin
app.use('/api/usuarios/achievement', achievementRoutes);
app.use('/api/configuracion', configuracionUsuarioRoutes); // <--- NUEVO

// Ruta de salud/prueba
app.get('/', (req, res) => {
  res.send('API funcionando');
});

// Manejo de rutas inexistentes (404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo global de errores (SIEMPRE al final)
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
