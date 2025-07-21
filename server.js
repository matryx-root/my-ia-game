// server.js
require('dotenv').config();
const app = require('./app'); // Importa la configuración completa del servidor (middlewares, rutas, frontend, errores)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
});
