const mysql = require('mysql');
const util = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('DATABASE CONNECTION WAS CLOSED');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('DATABASE HAS TO MANY CONNECTIONS');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('DATABASE CONNECTION WAS REFUSED');
    }
  }

  if (connection) {
    console.log(`DB is Connected as id: ${connection.threadId}`);
    connection.query('SELECT * FROM usuario', (err, rows) => {
      connection.release();
      if (err) throw err;
      console.log('The number of users registered are: ', rows.length);
    });
  }
});

// promisify pool queries
pool.query = util.promisify(pool.query);

module.exports = pool;
