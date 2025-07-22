// prisma/seedUsuarios.js
const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function seedUsuarios() {
  await prisma.usuario.createMany({
    data: [
      {
        id: 1,
        nombre: "Perla Velasquez",
        email: "test1@example.com",
        password: "123456" // o un hash si quieres
      },
      {
        id: 2,
        nombre: "Cristina Velasquez",
        email: "test2@example.com",
        password: "123456"
      }
    ],
    skipDuplicates: true
  });
  console.log('Seed de usuarios completado');
}

module.exports = seedUsuarios;
