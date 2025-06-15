const express = require('express');
const cors = require('cors');
require('dotenv').config();

const usuarioRoutes = require('./routes/usuarioRoutes');
const juegoRoutes = require('./routes/juegoRoutes');
const adminRoutes = require('./routes/adminRoutes');
    // <-- NUEVO

const app = express();
app.use(cors());
app.use(express.json());

// Rutas principales
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/admin', adminRoutes);



// (opcional) Ruta base de salud
app.get('/', (req, res) => {
  res.send('API funcionando');
});

module.exports = app;
