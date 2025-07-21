
const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',          
  port: 5432,                 
  user: 'postgres',           
  password: 'Simi1935',       
  database: 'GameAdm'         
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
