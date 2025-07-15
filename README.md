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
* Mas informacion en 

- [Script de creación de base de datos](./postgreSQL/db_create.sql)
- [Ver carpeta completa de SQL + ER](./postgreSQL/)

### 3. Variables de entorno

#### Backend

Revisa el archivo [.env](./backend/.env), con contenido similar a:




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
npx prisma migrate dev --name Creacion de tablas en BD

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

