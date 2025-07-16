const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
 
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
    skipDuplicates: true
  });
}

main().catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
