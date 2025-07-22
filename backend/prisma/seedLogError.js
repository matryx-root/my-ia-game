const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function seedLogError() {
  await prisma.logError.createMany({
    data: [
      { usuarioId: 1, juegoId: 2, fechaHora: new Date(), mensaje: 'No se pudo guardar', detalle: 'DB timeout' },
      { usuarioId: null, juegoId: null, fechaHora: new Date(), mensaje: 'Error general', detalle: 'Fallo inesperado' },
    ],
  });
  console.log('Seed de LogError completado');
}

module.exports = seedLogError;
