const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

// OBTENER todos los juegos
exports.getAll = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREAR un nuevo juego
exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, archivo } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const nuevo = await prisma.juego.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        archivo: archivo || null, // nombre del archivo JS si se subió antes
      }
    });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// EDITAR un juego
exports.update = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { nombre, descripcion, archivo } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const actualizado = await prisma.juego.update({
      where: { id },
      data: {
        nombre,
        descripcion: descripcion || null,
        archivo: archivo || null
      }
    });
    res.json(actualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ELIMINAR un juego
exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    // Busca el juego antes de eliminar para obtener el archivo asociado (si lo quieres borrar del FS)
    const juego = await prisma.juego.findUnique({ where: { id } });
    await prisma.juego.delete({ where: { id } });

    // Si quieres borrar el archivo JS asociado del FS:
    if (juego && juego.archivo) {
      const ruta = path.join(__dirname, '..', 'games', juego.archivo);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// SUBIR archivo .js (por separado, antes o después de crear/editar el juego)
exports.uploadArchivo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });

    // Puedes devolver el nombre del archivo para que el frontend lo use al crear el juego
    res.json({ archivo: req.file.filename, original: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DESCARGAR archivo .js
exports.downloadArchivo = (req, res) => {
  const archivo = req.params.archivo;
  const ruta = path.join(__dirname, '..', 'games', archivo);
  if (!fs.existsSync(ruta)) return res.status(404).json({ error: 'Archivo no existe' });
  res.download(ruta);
};
