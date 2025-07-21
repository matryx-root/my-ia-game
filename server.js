const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// === Tus rutas aquí ===
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/usuarios/achievement', require('./routes/achievementRoutes'));
app.use('/api/juegos', require('./routes/juegoRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/admin/juegos', require('./routes/juegosAdminRoutes'));
app.use('/api/colegios', require('./routes/colegioRoutes'));
app.use('/api/mensajes', require('./routes/mensajes'));
app.use('/api/dashboard', require('./routes/dashboardAdminRoutes'));
app.use('/api/configuracion', require('./routes/configuracionUsuario'));
app.use('/api/logs-juego', require('./routes/logJuegoRoutes'));
app.use('/api/logs-error', require('./routes/logErrorRoutes'));

// === Frontend en producción (React compilado) ===
const buildPath = path.join(__dirname, 'frontend', 'build');
app.use(express.static(buildPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// === Puerto ===
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
