/*
  Warnings:

  - You are about to drop the `LogJuego` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Puntaje` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LogJuego" DROP CONSTRAINT "LogJuego_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "LogJuego" DROP CONSTRAINT "LogJuego_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "Puntaje" DROP CONSTRAINT "Puntaje_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Puntaje" DROP CONSTRAINT "Puntaje_usuarioId_fkey";

-- DropTable
DROP TABLE "LogJuego";

-- DropTable
DROP TABLE "Puntaje";
