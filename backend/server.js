require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;

const frontendPath = path.join(__dirname, '..', 'frontend', 'build');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en puerto ${PORT}`);
});
