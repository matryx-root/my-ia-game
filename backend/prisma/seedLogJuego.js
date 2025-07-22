const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function seedLogJuego() {
  await prisma.logJuego.createMany({
    data: [
      { usuarioId: 1, juegoId: 2, fechaHora: new Date(), accion: 'inicio', detalle: 'Nivel 1', duracion: 60 },
      { usuarioId: 1, juegoId: 2, fechaHora: new Date(), accion: 'fin', detalle: 'Puntaje 80', duracion: 200 },
    ],
  });
  console.log('Seed de LogJuego completado');
}

module.exports = seedLogJuego;
