const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// Configurar Express para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'build')));

// Redirigir todas las rutas al index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Frontend server is running on port ${PORT}`);
});