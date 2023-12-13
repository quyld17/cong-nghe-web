const mysql = require('mysql2/promise');

console.log('Creating connection pool...')

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'cnw'
});



module.exports = pool;