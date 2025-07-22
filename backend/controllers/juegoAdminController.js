const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');
const path = require('path');
const fs = require('fs');


const gamesPath = path.join(__dirname, '..', '..', 'frontend', 'src', 'games');


exports.getAll = async (req, res) => {
  try {
    const juegos = await prisma.juego.findMany();
    res.json(juegos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, archivo } = req.body;
    if (!nombre) return res.status(400).json({ error: "El nombre es obligatorio" });

    const nuevo = await prisma.juego.create({
      data: {
        nombre,
        descripcion: descripcion || null,
        archivo: archivo || null, 
      }
    });
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


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


exports.delete = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const juego = await prisma.juego.findUnique({ where: { id } });
    if (!juego) return res.status(404).json({ error: "Juego no encontrado" });

    await prisma.juego.delete({ where: { id } });

  
    if (juego.archivo) {
      const ruta = path.join(gamesPath, juego.archivo);
      if (fs.existsSync(ruta)) fs.unlinkSync(ruta);
    }

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


exports.uploadArchivo = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No se subió archivo' });

   
    res.json({ archivo: req.file.originalname });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.downloadArchivo = (req, res) => {
  const archivo = req.params.archivo;
  const ruta = path.join(gamesPath, archivo);
  if (!fs.existsSync(ruta)) return res.status(404).json({ error: 'Archivo no existe' });
  res.download(ruta);
};
