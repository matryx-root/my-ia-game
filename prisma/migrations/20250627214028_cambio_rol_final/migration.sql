-- CreateEnum
CREATE TYPE "RolUsuario" AS ENUM ('alumno', 'docente');

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "colegioId" INTEGER,
ALTER COLUMN "rol" DROP NOT NULL,
ALTER COLUMN "rol" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Colegio" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,

    CONSTRAINT "Colegio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_colegioId_fkey" FOREIGN KEY ("colegioId") REFERENCES "Colegio"("id") ON DELETE SET NULL ON UPDATE CASCADE;
