const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.RDS_DATABASE_URL) {
  // En producción (Heroku)
  pool = new Pool({
    connectionString: process.env.RDS_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // necesario para conectar a bases remotas en Heroku
    },
  });
} else {
  // En desarrollo local
  pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASS || 'Simi1935',
    database: process.env.DB_NAME || 'GameAdm',
  });
}

module.exports = pool;
