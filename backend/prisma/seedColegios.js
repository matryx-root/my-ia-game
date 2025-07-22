// backend/seed/seedColegios.js

const { PrismaClient } = require('@prisma/client');
const prisma = require('../prismaClient');

async function seedColegios() {
  console.log('Iniciando seed de colegios...');

  try {
    await prisma.colegio.createMany({
      data: [
        { nombre: "ESCUELA MEXICO", nivel: "BASICA" },
        { nombre: "ESCUELA CHILE", nivel: "BASICA" },
        { nombre: "ESCUELA RUDOLF STEINER", nivel: "BASICA" },
        { nombre: "LICEO BICENTENARIO CIUDAD DE LOS RIOS", nivel: "CIENTIFICO-HUMANISTA, TP" },
        { nombre: "LICEO INDUSTRIAL DE VALDIVIA", nivel: "TECNICO-PROFESIONAL" },
        { nombre: "LICEO BENJAMIN VICUNA MACKENNA", nivel: "CIENTIFICO-HUMANISTA" },
        { nombre: "LICEO ARMANDO ROBLES RIVERA", nivel: "CIENTIFICO-HUMANISTA Y ARTISTICO" },
        { nombre: "ESCUELA TENIENTE MERINO", nivel: "BASICA" },
        { nombre: "ESCUELA FEDOR DOSTOIEVSKI", nivel: "BASICA" },
        { nombre: "COLEGIO SAN LUIS DE ALBA", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO ALONSO DE ERCILLA", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO MARIA AUXILIADORA", nivel: "BASICA Y MEDIA, FEMENINO" },
        { nombre: "COLEGIO NUESTRA SEÑORA DEL CARMEN", nivel: "BASICA Y MEDIA, MASCULINO" },
        { nombre: "COLEGIO SANTA CRUZ", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO WINDSOR SCHOOL", nivel: "BASICA Y MEDIA, BILINGUE" },
        { nombre: "COLEGIO CRISTIANO BELEN", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO MASTERS COLLEGE", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO HELVECIA", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO HONORIO OJEDA VALDERAS", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO ALEMAN RUDOLF DECKWERTH", nivel: "BASICA Y MEDIA, ALEMAN" },
        { nombre: "COLEGIO AUSTRAL DE VALDIVIA", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO MONTESSORI", nivel: "BASICA" },
        { nombre: "COLEGIO NUCLEO EDUCATIVO", nivel: "BASICA Y MEDIA" },
        { nombre: "COLEGIO DEPORTIVO MUNICIPAL DE VALDIVIA", nivel: "BASICA Y MEDIA, ENFOQUE DEPORTIVO" },
        { nombre: "LICEO TECNICO VALDIVIA", nivel: "TP" },
        { nombre: "CENTRO EDUCATIVO FERNANDO SANTIVAN", nivel: "TP" }
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