¡Por supuesto! Aquí tienes el **README.md** listo para copiar, con un formato profesional, instrucciones claras y adaptado a tu proyecto **my-ia-game**:

---

```markdown
# My IA Game

Plataforma educativa de juegos interactivos para aprender sobre Inteligencia Artificial.  
Incluye gestión de usuarios (alumnos, docentes, administradores), dashboards, mensajería interna y seguimiento de progreso gamificado.

---

## 🗂️ Estructura del Repositorio

```

my-ia-game/
│
├── backend/      # API Node.js + Express + Prisma + PostgreSQL
├── frontend/     # React + Bootstrap + Phaser.js
├── .gitignore
├── .gitattributes
└── README.md

````

---

## 🚦 Requisitos Previos

- **Node.js** 18 o superior
- **npm** (gestor de paquetes de Node)
- **PostgreSQL** 14+
- **Git** (para clonar y gestionar versiones)
- **Prisma CLI** (instalado como dependencia en backend)

---

## 🚀 Instalación Rápida

### 1. Clonar el repositorio

```bash
git clone https://github.com/matryx-root/my-ia-game.git
cd my-ia-game
````

### 2. Configuración de la base de datos PostgreSQL

* Crea una base de datos vacía llamada, por ejemplo, `myiagame`
* Guarda usuario, contraseña, host y puerto (default: 5432)

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





### 3. Variables de entorno

#### Backend

Crea el archivo `.env` en `/backend`, con contenido similar a:

```ini
DATABASE_URL="postgresql://TU_USUARIO:TU_PASSWORD@localhost:5432/myiagame"
JWT_SECRET="pon_un_secreto_fuerte_aqui"
PORT=4000
```

#### Frontend

Normalmente no requiere configuración especial, a menos que cambies el endpoint del backend.

### 4. Instalar dependencias

```bash
cd backend
npm install --legacy-peer-deps
cd ../frontend
npm install --legacy-peer-deps
```

### 5. Migraciones y Seeds (Prisma)

Ejecuta en `/backend`:

```bash
npx prisma migrate dev --name init

Ejecuta en `/backend/prisma`:
npx prisma db seedColegios.js
npx prisma db seedJuegos.js
npx prisma db seedLogError.js
npx prisma db seedLogIngreso.js
npx prisma db prisma/seedLogJuego.js
```

* Esto crea las tablas y carga datos de prueba definidos en `prisma/seed.js`.

### 6. Ejecución

#### Backend

```bash
cd backend
node server.js
```

El backend estará en: [http://localhost:5000](http://localhost:5000)

#### Frontend

```bash
cd frontend
npm start
```

El frontend estará en: [http://localhost:3000](http://localhost:3000)

---

## 👤 Usuarios de prueba

* Puedes crear usuarios desde la interfaz o mediante seeds.
* Los usuarios, roles y contraseñas de ejemplo están definidos en `prisma/seed.js`.
* Roles: **admin**, **docente**, **alumno**.

---

## 📦 Comandos útiles

```bash
# Migraciones Prisma
npx prisma migrate dev

# Regenerar cliente Prisma
npx prisma generate

# Ejecutar seeds
npx prisma db seed
```

---

## 🧩 Estructura básica de carpetas

* **backend/**: API REST, lógica de negocio, conexión a PostgreSQL, autenticación y administración de datos.
* **frontend/**: Interfaz visual (React, Bootstrap, Phaser para juegos educativos).
* **prisma/**: Definición del modelo de datos, migraciones y seeds automáticos.

---

## ⚠️ Notas y consejos

* Verifica que PostgreSQL esté corriendo antes de migrar o seedear.
* Si editas el esquema de datos, recuerda:

  ```bash
  npx prisma migrate dev
  npx prisma generate
  ```
* Revisa bien `.env` y permisos de usuario en PostgreSQL.
* El frontend y backend pueden correr simultáneamente.

---

## 👨‍💻 Autor

Simón Velasquez Carcamo
GitHub: [matryx-root](https://github.com/matryx-root)

---

## 📝 Licencia

MIT

````

