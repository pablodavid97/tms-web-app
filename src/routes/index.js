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
      role = rows[0];
      const isStudent = (role.nombre === "Estudiante");
      const isProfessor = (role.nombre === "Profesor");
      const isDean = (role.nombre === "Decano");
      studentInfo = {};
      tutor = {}

      if (isStudent) {
        const rows2 = await pool.query("SELECT * FROM estudiante WHERE usuario_id = ?", [req.user.usuario_id]);
        studentInfo = rows2[0]

        const rows3 = await pool.query("SELECT * FROM usuario WHERE usuario_id = ?", [studentInfo.profesor_usuario_id]);
        tutor = rows3[0];
      }

      res.render('user-profile', {website: true, user: req.user, role: role, isStudent: isStudent, studentInfo: studentInfo, tutor: tutor, isProfessor: isProfessor, isDean: isDean, success: req.flash('success'), error: req.flash('error')});
    }
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router; 
