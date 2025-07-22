-- CreateTable
CREATE TABLE "LogIngreso" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ip" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "LogIngreso_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogJuego" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "juegoId" INTEGER NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "accion" TEXT,
    "detalle" TEXT,
    "duracion" INTEGER,

    CONSTRAINT "LogJuego_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogError" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER,
    "juegoId" INTEGER,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mensaje" TEXT NOT NULL,
    "detalle" TEXT,

    CONSTRAINT "LogError_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MensajeSoporte" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "mensaje" TEXT NOT NULL,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "respuesta" TEXT,

    CONSTRAINT "MensajeSoporte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgresoUsuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "juegoId" INTEGER,
    "preguntaId" INTEGER,
    "avance" INTEGER,
    "completado" BOOLEAN,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgresoUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "juegoId" INTEGER,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "fechaHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionUsuario" (
    "id" SERIAL NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "tema" TEXT,
    "idioma" TEXT,
    "sonido" BOOLEAN,
    "notificaciones" BOOLEAN,

    CONSTRAINT "ConfiguracionUsuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionUsuario_usuarioId_key" ON "ConfiguracionUsuario"("usuarioId");

-- AddForeignKey
ALTER TABLE "LogIngreso" ADD CONSTRAINT "LogIngreso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogJuego" ADD CONSTRAINT "LogJuego_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogJuego" ADD CONSTRAINT "LogJuego_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogError" ADD CONSTRAINT "LogError_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogError" ADD CONSTRAINT "LogError_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MensajeSoporte" ADD CONSTRAINT "MensajeSoporte_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgresoUsuario" ADD CONSTRAINT "ProgresoUsuario_preguntaId_fkey" FOREIGN KEY ("preguntaId") REFERENCES "Pregunta"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_juegoId_fkey" FOREIGN KEY ("juegoId") REFERENCES "Juego"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfiguracionUsuario" ADD CONSTRAINT "ConfiguracionUsuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
