/*
  Warnings:

  - You are about to drop the column `preguntaId` on the `ProgresoUsuario` table. All the data in the column will be lost.
  - You are about to drop the `NivelIA` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pregunta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Respuesta` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `juegoId` on table `ProgresoUsuario` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Pregunta" DROP CONSTRAINT "Pregunta_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Pregunta" DROP CONSTRAINT "Pregunta_nivelIAId_fkey";

-- DropForeignKey
ALTER TABLE "ProgresoUsuario" DROP CONSTRAINT "ProgresoUsuario_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "ProgresoUsuario" DROP CONSTRAINT "ProgresoUsuario_preguntaId_fkey";

-- DropForeignKey
ALTER TABLE "Respuesta" DROP CONSTRAINT "Respuesta_preguntaId_fkey";

-- AlterTable
ALTER TABLE "ProgresoUsuario" DROP COLUMN "preguntaId",
ALTER COLUMN "juegoId" SET NOT NULL;

-- DropTable
DROP TABLE "NivelIA";

-- DropTable
DROP TABLE "Pregunta";

-- DropTable
DROP TABLE "Respuesta";

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
