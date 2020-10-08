const express = require('express');
const pool = require('../database');

const router = express.Router();

router.get('/', async (req, res) => {
  res.render('auth/signin', {website: true, pageTitle: "USFQ Tutorías", success: req.flash('success'), message: req.flash('message')});
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
