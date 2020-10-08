const express = require('express');
const pool = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const rows = await pool.query('SELECT * FROM usuario');

    console.log("Rows", rows);

    if (rows.length > 0) {
      console.log('The number of users registered are: ', rows.length);
    }
  } catch (error) {
    console.log("Error: ", error.message);
  }

  res.render('auth/signin', {website: true, pageTitle: "USFQ Tutorías", success: req.flash('success')});
});

router.get('/flash', async (req, res) => {
  console.log("Flash Message", "Flash is back!");

  req.flash('success', "Flash is back!");
  res.redirect('/')
});

router.get('/home', (req, res) => {
  res.render('home', {website: true, success: req.flash('success'), message: req.flash('message')});
});

module.exports = router; 
