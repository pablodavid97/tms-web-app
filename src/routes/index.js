const express = require('express');
const pool = require('../database');

const router = express.Router();

pool.query('SELECT * FROM usuario', (error, results, fields) => {
  if (error) throw error;
  
  console.log('The number of users registered are: ', results.length);
});

router.get('/', (req, res) => {
  res.render('auth/signin', {pageTitle: "USFQ Tutorías"});
});

router.get('/home', (req, res) => {
  res.send("Success Login")
});

module.exports = router; 
