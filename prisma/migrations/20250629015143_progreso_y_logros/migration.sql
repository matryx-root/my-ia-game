/*
  Warnings:

  - The `rol` column on the `Usuario` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProgresoUsuario" ADD COLUMN     "aciertos" INTEGER,
ADD COLUMN     "desaciertos" INTEGER;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "rol",
ADD COLUMN     "rol" "RolUsuario" NOT NULL DEFAULT 'alumno';
