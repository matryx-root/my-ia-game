const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listarColegios = async (req, res) => {
  try {
    const colegios = await prisma.colegio.findMany();
    res.json(colegios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.crearColegio = async (req, res) => {
  try {
    const { nombre, nivel } = req.body;
    const colegio = await prisma.colegio.create({ data: { nombre, nivel } });
    res.status(201).json({ mensaje: "Colegio creado", colegio });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
