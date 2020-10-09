const express = require('express');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('auth/signin', {website: true, pageTitle: "USFQ Tutorías", success: req.flash('success'), error: req.flash('error')});
});

router.get('/home', isLoggedIn, async (req, res) => {
  try{
    console.log("Logged User: ", user);

    const rows = await pool.query("SELECT * FROM rol WHERE rol_id = ?", [req.user.rol_id]);
  
    if(rows.length > 0) {
      res.render('home', {website: true, user: req.user, role: rows[0], success: req.flash('success'), error: req.flash('error')});
    }
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router; 
