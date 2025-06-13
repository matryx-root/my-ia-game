// backend/prismaClient.js
const { PrismaClient } = require('./generated/prisma'); // <- RUTA PERSONALIZADA
const prisma = new PrismaClient();

module.exports = prisma;
