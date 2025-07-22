const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function checkSeed() {
  const usuarios = await prisma.usuario.findMany();
  console.log(usuarios);
  await prisma.$disconnect();
}

checkSeed();
