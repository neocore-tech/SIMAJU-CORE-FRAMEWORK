const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || '127.0.0.1',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'catat',
  user: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'qawsed789',
});

console.log('--- Database Connection Test ---');
console.log(`Target: ${process.env.DB_USERNAME}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`);

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Connection Failed!');
    console.error('Error Code:', err.code);
    console.error('Message:', err.message);
  } else {
    console.log('✅ Connection Successful!');
    console.log('Server Time:', res.rows[0].now);
  }
  pool.end();
});
