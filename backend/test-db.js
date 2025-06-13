// backend/test-db.js
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',          // o IP del server PostgreSQL
  port: 5432,                 // puerto default PostgreSQL
  user: 'postgres',           // TU USUARIO (¡cámbialo si no es 'postgres'!)
  password: 'Simi1935',       // TU CONTRASEÑA REAL
  database: 'GameAdm'         // NOMBRE DE TU BASE DE DATOS
});

pool.connect()
  .then(client => {
    console.log('✔️ ¡Conectado a PostgreSQL!');
    client.release();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERROR al conectar a PostgreSQL:', err);
    process.exit(1);
  });
