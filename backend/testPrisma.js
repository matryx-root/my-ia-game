const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const usuarios = await prisma.usuario.findMany({
      take: 1,
    });
    console.log('Conexión exitosa, usuarios:', usuarios);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
