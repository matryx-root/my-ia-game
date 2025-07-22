const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'production') {
  pool = new Pool({
    connectionString: process.env.RDS_DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });
} else {
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

// Añade esto para debug
pool.on('connect', () => console.log('✔ Connected to DB'));
pool.on('error', (err) => console.error('❌ DB connection error', err));

module.exports = {
  query: (text, params) => {
    console.log('Executing query:', text);
    return pool.query(text, params);
  },
};