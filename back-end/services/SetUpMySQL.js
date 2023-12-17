const mysql = require("mysql2");

// const db = mysql.createConnection({
//   host: "127.0.0.1",
//   user: "root",
//   password: "038202001252",
//   database: "cn-web",
// });

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "cnw",
}); 

module.exports = db;
