const express = require('express');
const cors = require('cors');
const { poolConnect } = require('./config/database');
const usuarioRoutes = require('./routes/usuarioRoutes');
const juegoRoutes = require('./routes/juegoRoutes');
const adminRoutes = require('./routes/adminRoutes');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// SOLO UNA VEZ cada ruta:
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/juegos', juegoRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;
