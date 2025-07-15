-- db_create.sql
-- Crea la base de datos principal para el sistema de juegos IA
-- Ejecutar primero este script en el servidor PostgreSQL

-- 1. Crear base de datos (ejecutar como usuario administrador en PostgreSQL)
CREATE DATABASE "GameAdm"
  WITH 
  OWNER = postgres
  ENCODING = 'UTF8'
  LC_COLLATE = 'es_CL.UTF-8'
  LC_CTYPE = 'es_CL.UTF-8'
  TABLESPACE = pg_default
  CONNECTION LIMIT = -1;

-- 2. Conectar a la base de datos
\c "GameAdm"

-- 3. Crear tablas y relaciones principales

CREATE TABLE "Colegio" (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    nivel VARCHAR(100) NOT NULL
);

CREATE TABLE "Usuario" (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL DEFAULT 'alumno',
    edad INTEGER,
    celular VARCHAR(50),
    colegioId INTEGER REFERENCES "Colegio"(id)
);

CREATE TABLE "Juego" (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    archivo VARCHAR(255)
);

CREATE TABLE "ConfiguracionUsuario" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER UNIQUE REFERENCES "Usuario"(id) ON DELETE CASCADE,
    tema VARCHAR(30),
    idioma VARCHAR(10),
    sonido BOOLEAN,
    notificaciones BOOLEAN
);

CREATE TABLE "MensajeSoporte" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
    mensaje TEXT NOT NULL,
    fechaHora TIMESTAMP DEFAULT now(),
    estado VARCHAR(30) DEFAULT 'pendiente',
    respuesta TEXT,
    leido BOOLEAN DEFAULT false
);

CREATE TABLE "ProgresoUsuario" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
    juegoId INTEGER NOT NULL REFERENCES "Juego"(id) ON DELETE CASCADE,
    avance INTEGER,
    completado BOOLEAN,
    aciertos INTEGER,
    desaciertos INTEGER,
    fechaActualizacion TIMESTAMP DEFAULT now()
);

CREATE TABLE "Achievement" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
    juegoId INTEGER REFERENCES "Juego"(id) ON DELETE CASCADE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fechaHora TIMESTAMP DEFAULT now()
);

CREATE TABLE "LogIngreso" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
    fechaHora TIMESTAMP DEFAULT now(),
    ip VARCHAR(50),
    userAgent VARCHAR(255)
);

CREATE TABLE "LogJuego" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER NOT NULL REFERENCES "Usuario"(id) ON DELETE CASCADE,
    juegoId INTEGER NOT NULL REFERENCES "Juego"(id) ON DELETE CASCADE,
    fechaHora TIMESTAMP DEFAULT now(),
    accion VARCHAR(100),
    detalle TEXT,
    duracion INTEGER
);

CREATE TABLE "LogError" (
    id SERIAL PRIMARY KEY,
    usuarioId INTEGER REFERENCES "Usuario"(id) ON DELETE CASCADE,
    juegoId INTEGER REFERENCES "Juego"(id) ON DELETE CASCADE,
    fechaHora TIMESTAMP DEFAULT now(),
    mensaje VARCHAR(255) NOT NULL,
    detalle TEXT
);

-- Índices recomendados
CREATE INDEX idx_usuario_email ON "Usuario"(email);
CREATE INDEX idx_logjuego_usuario ON "LogJuego"(usuarioId);
CREATE INDEX idx_logjuego_juego ON "LogJuego"(juegoId);

-- Fin del script de creación de GameAdm
