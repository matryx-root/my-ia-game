// server.js
require('dotenv').config();
const app = require('./app'); // Importa la configuración completa del servidor (middlewares, rutas, frontend, errores)

const PORT = process.env.PORT || 3000;
const path = require('path');

console.log('Path absoluto a frontend/build/index.html:', path.join(__dirname, 'frontend', 'build', 'index.html'));


app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
