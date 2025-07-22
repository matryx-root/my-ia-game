const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSeed() {
  const usuarios = await prisma.usuario.findMany();
  console.log(usuarios);
  await prisma.$disconnect();
}

checkSeed();
