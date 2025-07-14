const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// Ruta absoluta a la carpeta donde se guardan los .js (React puede verlos)
const gamesPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'games');

// ==========================
// LISTAR todos los juegos
exports.getAll = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// CREAR un nuevo juego
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, archivo } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const nuevo = await prisma.juego.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        archivo: archivo || null, // El nombre del archivo .js, si fue subido antes
      }
    });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==========================
// EDITAR un juego existente
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, archivo } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const existe = await prisma.juego.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ error: "Juego no encontrado" });

    const actualizado = await prisma.juego.update({
      where: { id },
      data: {
        nombre,
        descripcion: descripcion || null,
        archivo: archivo || null,
      }
    });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==========================
// ELIMINAR un juego (y el archivo físico si existe)
exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const juego = await prisma.juego.findUnique({ where: { id } });
    if (!juego) return res.status(404).json({ error: "Juego no encontrado" });

    await prisma.juego.delete({ where: { id } });

    // Borra el archivo JS del sistema de archivos si existe
    if (juego.archivo) {
      const ruta = path.join(gamesPath, juego.archivo);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ==========================
// SUBIR archivo .js (llave: "archivo")
exports.uploadArchivo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });

    // Usamos el nombre original para que sea igual que en src/games
    res.json({ archivo: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ==========================
// DESCARGAR archivo .js
exports.downloadArchivo = (req, res) => {
  const archivo = req.params.archivo;
  const ruta = path.join(gamesPath, archivo);
  if (!fs.existsSync(ruta)) return res.status(404).json({ error: 'Archivo no existe' });
  res.download(ruta);
};
