const express = require('express');
const db = require('../database');

const router = express.Router();

db.query('SELECT * FROM usuario', function (error, results, fields) {
  if (error) throw error;
  
  console.log('The number of users registered are: ', results.length);
});

router.get('/', (req, res) => {
  res.send('Hello World');
});

module.exports = router; 
