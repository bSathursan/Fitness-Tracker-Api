const mysql = require('mysql2');
const dbConfignew = require('./config.json');

// Create a connection to the database
const connection = mysql.createConnection({
  host: dbConfignew.database.host,
  user: dbConfignew.database.user,
  password: dbConfignew.database.password,
  database: dbConfignew.database.database,
  multipleStatements: true,
});
module.exports = connection;
