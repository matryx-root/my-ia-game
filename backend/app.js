
const express = require('express');
const cors = require('cors');
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
app.use(express.json());
app.use(cors());


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


app.get('/', (req, res) => {
  res.send('API funcionando');
});


app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});


app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ error: err.message || 'Error interno del servidor' });
});

module.exports = app;
