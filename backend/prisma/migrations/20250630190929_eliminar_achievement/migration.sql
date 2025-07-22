/*
  Warnings:

  - You are about to drop the `Achievement` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_usuarioId_fkey";

-- DropTable
DROP TABLE "Achievement";
