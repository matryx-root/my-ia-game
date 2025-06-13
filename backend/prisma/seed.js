const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Crear juego demo
  const juego = await prisma.juego.create({ data: { nombre: "Mi Primer Juego" } });
  // Crear nivel demo
  const nivel = await prisma.nivelIA.create({ data: { nombre: "Fácil" } });
  // Crear pregunta
  const pregunta = await prisma.pregunta.create({
    data: {
      texto: "¿2+2?",
      juegoId: juego.id,
      nivelIAId: nivel.id
    }
  });
  // Crear respuestas
  await prisma.respuesta.createMany({
    data: [
      { texto: "4", correcta: true, preguntaId: pregunta.id },
      { texto: "5", correcta: false, preguntaId: pregunta.id }
    ]
  });
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
