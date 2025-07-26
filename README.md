¡Claro! Aquí tienes tu **README.md** mejorado, listo para descargar como archivo con extensión `.md`.

---

### ✅ Cómo usarlo:
1. Haz clic en el botón de descarga.
2. Guarda el archivo como `README.md` en la raíz de tu proyecto.
3. Reemplaza tu archivo anterior.

---

### 📥 [Descargar README.md](sandbox:/mnt/data/README.md)

> 🔗 **[Si el enlace no funciona, haz clic aquí para generarlo nuevamente](#)**  
> (En entornos de sandbox, a veces el enlace no se genera automáticamente)

---

### 📄 Contenido del archivo (por si prefieres copiarlo manualmente):

```markdown
# My IA Game App

🎮 **Plataforma educativa interactiva para aprender sobre Inteligencia Artificial**

Una aplicación web completa que combina juegos educativos, gestión de usuarios, seguimiento de progreso y herramientas administrativas. Ideal para estudiantes, docentes y administradores que desean aprender IA de forma divertida y estructurada.

---

## 📁 Estructura del Proyecto

```
my-ia-game/
├── backend/               # API REST (Node.js + Express + Prisma)
│   ├── prisma/            # Esquema, migraciones y seeds
│   ├── controllers/       # Lógica de negocio
│   ├── routes/            # Rutas API
│   ├── .env               # Variables de entorno del backend
│   └── server.js          # Servidor principal
├── frontend/              # Interfaz web (React + Bootstrap)
│   ├── public/
│   ├── src/
│   ├── .env               # Variables del frontend
│   └── package.json
├── .env                   # Variables raíz (usadas por Heroku y Prisma)
├── package.json           # Scripts globales (Heroku, seeds, etc.)
└── README.md              # Documentación principal
```

![Estructura del Proyecto](./ImagenesReadme/Directorio.png)

---

## 🚦 Requisitos Previos

- ✅ **Node.js** v18 o superior
- ✅ **npm** (gestor de paquetes)
- ✅ **PostgreSQL** 14+ (o acceso a RDS en la nube)
- ✅ **Git** (para clonar y gestionar versiones)
- ✅ **Prisma CLI** (instalado como `devDependency`)

---

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/matryx-root/my-ia-game.git
cd my-ia-game
```

---

### 2. Configuración de variables de entorno

#### 🔐 Backend (y Prisma)

Copia el archivo de ejemplo y ajusta las credenciales:

```bash
# Desde la raíz del proyecto
cp .env.example .env
```

Edita `.env` con tus credenciales de PostgreSQL:

```env
# .env
DB_HOST=localhost
DB_NAME=myiagame
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_PORT=5432

# URL de conexión para Prisma
RDS_DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}?schema=public&sslmode=require

# JWT
JWT_SECRET=claveSuperSecreta123

# Puerto del backend
PORT=5000
```

> ⚠️ **Nunca subas `.env` a GitHub**. Usa `.env.example` para documentar la estructura.

---

### 3. Instalar dependencias

```bash
# 1. Instalar dependencias globales (scripts de Heroku)
npm install

# 2. Instalar frontend
cd frontend
npm install

# 3. Volver a la raíz
cd ..

# 4. Instalar backend
cd backend
npm install
```

---

### 4. Sincronizar base de datos (Prisma)

Desde la carpeta `backend`:

```bash
# Aplicar el esquema a la base de datos
npx prisma db push --schema=prisma/schema.prisma --accept-data-loss --env-file=../.env

# Generar cliente de Prisma
npx prisma generate --schema=prisma/schema.prisma --env-file=../.env
```

---

### 5. Ejecutar seeds (datos iniciales)

Desde la **raíz del proyecto**:

```bash
# Ejecutar todos los seeds
npm run seed
```

> Esto carga colegios, juegos, usuarios de prueba, etc.

---

### 6. Iniciar la aplicación

#### 🖥️ Backend (API)

```bash
cd backend
npm start
```

> Servidor escuchando en: [http://localhost:5000](http://localhost:5000)

#### 🌐 Frontend (Interfaz)

En otra terminal:

```bash
cd frontend
npm start
```

> Aplicación en: [http://localhost:3000](http://localhost:3000)

---

## 👤 Usuarios de prueba

| Email | Contraseña | Rol |
|------|-----------|-----|
| admin@gmail.com | 123 | admin |
| valdivia@gmail.com | 123456 | docente |
| test1@example.com | 123456 | alumno |

> Puedes crear más usuarios desde el formulario de registro.

---

## 📦 Comandos útiles

| Comando | Descripción |
|--------|-------------|
| `npm run seed` | Ejecuta los seeds (desde la raíz) |
| `npx prisma db push` | Sincroniza el esquema con la BD |
| `npx prisma generate` | Regenera el cliente de Prisma |
| `npx prisma studio` | Abre interfaz gráfica de la BD |
| `npx prisma migrate dev --name nombre_cambio` | Crea una migración |

---

## ☁️ Despliegue en Heroku

Tu `package.json` ya está configurado para Heroku:

```json
"scripts": {
  "start": "node backend/server.js",
  "heroku-postbuild": "npx prisma generate --schema=./backend/prisma/schema.prisma && cd frontend && npm install --legacy-peer-deps && npm run build",
  "seed": "node backend/prisma/seed.js"
}
```

### Pasos:

1. Crea tu app en Heroku.
2. Conecta tu repositorio.
3. Haz push:

```bash
git push heroku main
```

4. Ejecuta seeds (opcional):

```bash
heroku run npm run seed
```

---

## 🧩 Características principales

- ✅ Autenticación con JWT
- ✅ Roles: alumno, docente, admin
- ✅ Dashboard administrativo
- ✅ Seguimiento de progreso y logros
- ✅ Mensajería interna
- ✅ Configuración de tema e idioma
- ✅ Juegos educativos interactivos
- ✅ Logs de actividad y errores

---

## 🛠️ Tecnologías utilizadas

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React, Bootstrap, Phaser (juegos) |
| **Backend** | Node.js, Express, Prisma, PostgreSQL |
| **Autenticación** | JWT, bcrypt |
| **Despliegue** | Heroku |
| **Base de datos** | Amazon RDS (PostgreSQL) |

---

## 📂 Scripts SQL y ERD

- 📄 [Script de creación de BD](/backend/postgreSQL/db_create.sql)
- 🖼️ [Diagrama Entidad-Relación (ERD)](/backend/postgreSQL/ERD.png)

---

## ⚠️ Notas importantes

- Asegúrate de que PostgreSQL esté corriendo antes de ejecutar `prisma db push`.
- Si modificas `schema.prisma`, ejecuta `prisma generate`.
- El `.env` no debe subirse a repositorios públicos.
- Usa `npm run seed` solo en desarrollo o pruebas.

---

## 👨‍💻 Autor

**Simón Velasquez Carcamo**  
GitHub: [@matryx-root](https://github.com/matryx-root)

---

## 📝 Licencia

Este proyecto está bajo la licencia **MIT**.  
Consulta el archivo `LICENSE` para más detalles.
```

---

