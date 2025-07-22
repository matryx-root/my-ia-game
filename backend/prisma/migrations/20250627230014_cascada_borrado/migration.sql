-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "Achievement" DROP CONSTRAINT "Achievement_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ConfiguracionUsuario" DROP CONSTRAINT "ConfiguracionUsuario_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "LogError" DROP CONSTRAINT "LogError_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "LogError" DROP CONSTRAINT "LogError_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "LogIngreso" DROP CONSTRAINT "LogIngreso_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "LogJuego" DROP CONSTRAINT "LogJuego_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "LogJuego" DROP CONSTRAINT "LogJuego_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "MensajeSoporte" DROP CONSTRAINT "MensajeSoporte_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "ProgresoUsuario" DROP CONSTRAINT "ProgresoUsuario_juegoId_fkey";

-- DropForeignKey
ALTER TABLE "ProgresoUsuario" DROP CONSTRAINT "ProgresoUsuario_usuarioId_fkey";

-- AddForeignKey
ALTER TABLE "LogIngreso" ADD CONSTRAINT "LogIngreso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogJuego" ADD CONSTRAINT "LogJuego_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogJuego" ADD CONSTRAINT "LogJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogError" ADD CONSTRAINT "LogError_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogError" ADD CONSTRAINT "LogError_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensajeSoporte" ADD CONSTRAINT "MensajeSoporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionUsuario" ADD CONSTRAINT "ConfiguracionUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
