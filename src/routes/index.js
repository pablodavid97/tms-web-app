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

router.get('/tutor', async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM rol WHERE rol_id = ?", [req.user.rol_id]);

    if (rows.length > 0) {
      role = rows[0]
      
      const rows2 = await pool.query("SELECT * FROM estudiante WHERE usuario_id = ?", [req.user.usuario_id]);
      studentInfo = rows2[0]

      const rows3 = await pool.query("SELECT * FROM usuario INNER JOIN profesor on usuario.usuario_id = profesor.usuario_id INNER JOIN estudiante on profesor.usuario_id = estudiante.profesor_usuario_id WHERE profesor.usuario_id = ?", [studentInfo.profesor_usuario_id])
      tutor = rows3[0]

      console.log("Tutor: ", tutor.nombres, tutor.apellidos);

      res.render('tutor', {website: true, user: req.user, role: role, isStudent: true, studentInfo: studentInfo, tutor: tutor, isProfessor: false, isDean: false, success: req.flash('success'), error: req.flash('error')})
    }

  } catch (error) {
    console.error(error.message);
  }
});

router.get('/students', async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.usuario_id = estudiante.usuario_id WHERE estudiante.profesor_usuario_id = ?", [req.user.usuario_id])
    console.log("Estudiantes: ", rows);

    res.render('students', {website: true, user: req.user, isProfessor: true, students: rows, success: req.flash('success'), error: req.flash('error')});
  } catch(error) {
    console.error(error.message);
  }
});

router.get('/student/:userId', async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.usuario_id = estudiante.usuario_id WHERE estudiante.usuario_id = ?", [req.params.userId]);
    
    if(rows.length > 0) {
      student = rows[0];
      console.log("Estudiante: ", student);

      res.render('student', {website: true, user: req.user, isProfessor: true, student: student, success: req.flash('success'), error: req.flash('error')});
    }
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/create-meeting', async (req, res) => {
  console.log("usuario: ", req.user);

  console.log("Datos Ingresados: ", req.body);

  var dateValues = req.body.date.split("/")

  var timeValues = req.body.time.split(':')

  // Converts PM values to 24 value
  if(req.body.format == 2 && timeValues[0] != "12") {
    timeValues[0] = String((parseInt(timeValues[0]) + 12) % 24)
  } else if (req.body.format == 1) {
      // Convertas 12 Am to 00 in 24 hour format
      if(timeValues[0] == "12") {
        timeValues[0] = "00";
      } else {
        timeValues[0] = ("0" + timeValues[0]).slice(-2) 
      }
  }

  // Creates date in standard datetime format YYYY-MM-DD hh:mm'
  var time = timeValues[0] + ":" + timeValues[1];
  var date = dateValues[2] + "-" + dateValues[1] + "-" + dateValues[0] + " " + time

  console.log("Date: " + date);


  try {
    await pool.query("INSERT INTO reunion (tema, descripcion, fecha, profesor_usuario_id, estudiante_usuario_id) VALUES (?, ?, ?, ?, ?)", [req.body.subject, req.body.description, date, req.user.usuario_id, req.body.student])
    
    req.flash("success", "La reunión fue creada con exito!");
    res.redirect('/meetings');
  } catch (error) {
    console.error(error.message);
  }
  // Create a new meeting
});

module.exports = router; 
