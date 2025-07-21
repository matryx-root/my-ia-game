const express = require('express');
const path = require('path');
const app = require('./app'); // Tu backend con rutas y middlewares

// Servir archivos estáticos desde frontend/build (carpeta frontal en raíz)
app.use(express.static(path.join(__dirname, 'frontend/build')));

// Redirigir rutas que no sean API al frontend para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✔️ Servidor backend + frontend corriendo en http://localhost:${PORT}`);
});
