// backend/seed/seedColegios.js

const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function seedColegios() {
  console.log('Iniciando seed de colegios...');

  try {
    await prisma.colegio.createMany({
      data: [
        { nombre: "Escuela México", nivel: "Básica" },
        { nombre: "Escuela Chile", nivel: "Básica" },
        { nombre: "Escuela Rudolf Steiner", nivel: "Básica" },
        { nombre: "Liceo Bicentenario Ciudad de Los Ríos", nivel: "Científico-Humanista, TP" },
        { nombre: "Liceo Industrial de Valdivia", nivel: "Técnico-Profesional" },
        { nombre: "Liceo Benjamín Vicuña Mackenna", nivel: "Científico-Humanista" },
        { nombre: "Liceo Armando Robles Rivera", nivel: "Científico-Humanista y Artístico" },
        { nombre: "Escuela Teniente Merino", nivel: "Básica" },
        { nombre: "Escuela Fedor Dostoievski", nivel: "Básica" },
        { nombre: "Colegio San Luis de Alba", nivel: "Básica y Media" },
        { nombre: "Colegio Alonso de Ercilla", nivel: "Básica y Media" },
        { nombre: "Colegio María Auxiliadora", nivel: "Básica y Media, femenino" },
        { nombre: "Colegio Nuestra Señora del Carmen", nivel: "Básica y Media, masculino" },
        { nombre: "Colegio Santa Cruz", nivel: "Básica y Media" },
        { nombre: "Colegio Windsor School", nivel: "Básica y Media, bilingüe" },
        { nombre: "Colegio Cristiano Belén", nivel: "Básica y Media" },
        { nombre: "Colegio Masters College", nivel: "Básica y Media" },
        { nombre: "Colegio Helvecia", nivel: "Básica y Media" },
        { nombre: "Colegio Honorio Ojeda Valderas", nivel: "Básica y Media" },
        { nombre: "Colegio Alemán Rudolf Deckwerth", nivel: "Básica y Media, alemán" },
        { nombre: "Colegio Austral de Valdivia", nivel: "Básica y Media" },
        { nombre: "Colegio Montesorri", nivel: "Básica" },
        { nombre: "Colegio Núcleo Educativo", nivel: "Básica y Media" },
        { nombre: "Colegio Deportivo Municipal de Valdivia", nivel: "Básica y Media, enfoque deportivo" },
        { nombre: "Liceo Técnico Valdivia", nivel: "TP" },
        { nombre: "Centro Educativo Fernando Santiván", nivel: "TP" }
      ],
      skipDuplicates: true,
    });

    console.log('✅ Seed de colegios completado exitosamente.');
  } catch (error) {
    console.error('❌ Error al ejecutar el seed de colegios:', error);
    throw error;
  } finally {
    // ¡Importante! Cierra la conexión de Prisma
    await prisma.$disconnect();
  }
}

module.exports = seedColegios;

// Si se ejecuta directamente (node seedColegios.js), llama a la función
if (require.main === module) {
  seedColegios()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}