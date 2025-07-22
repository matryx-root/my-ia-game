const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function seedLogIngreso() {
  await prisma.logIngreso.createMany({
    data: [
      { usuarioId: 1, fechaHora: new Date(), ip: '192.168.1.10', userAgent: 'Mozilla/5.0' },
      { usuarioId: 2, fechaHora: new Date(Date.now() - 86400000), ip: '190.54.90.22', userAgent: 'Chrome/122.0' },
    ],
  });
  console.log('Seed de LogIngreso completado');
}

module.exports = seedLogIngreso;
