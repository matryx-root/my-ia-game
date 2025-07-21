const express = require('express');
const path = require('path');
const app = express();

// Servir archivos estáticos desde la carpeta frontend/build
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Cualquier ruta que no sea API, enviar index.html para que React maneje rutas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Aquí van tus rutas API normales, por ejemplo:
// app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
