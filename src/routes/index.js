const express = require('express');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn, isDeanUser, isProfessorUser, isStudentUser, isUserStudentOrProfessor } = require('../lib/auth');

const router = express.Router();

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('auth/signin', {website: true, path: "signin", pageTitle: "USFQ Tutorías", success: req.flash('success'), error: req.flash('error')});
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

      res.render('user-profile', {website: true, path: "home", user: req.user, role: role, isStudent: isStudent, studentInfo: studentInfo, tutor: tutor, isProfessor: isProfessor, isDean: isDean, success: req.flash('success'), error: req.flash('error')});
    }
  } catch (error) {
    console.error(error.message);
  }

});

router.get('/tutor', isLoggedIn, isStudentUser, async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM rol WHERE rol_id = ?", [req.user.rol_id]);

    if (rows.length > 0) {
      role = rows[0]
      
      const rows2 = await pool.query("SELECT * FROM estudiante WHERE usuario_id = ?", [req.user.usuario_id]);
      studentInfo = rows2[0]

      const rows3 = await pool.query("SELECT * FROM usuario INNER JOIN profesor on usuario.usuario_id = profesor.usuario_id INNER JOIN estudiante on profesor.usuario_id = estudiante.profesor_usuario_id WHERE profesor.usuario_id = ?", [studentInfo.profesor_usuario_id])
      tutor = rows3[0]

      console.log("Tutor: ", tutor.nombres, tutor.apellidos);

      res.render('tutor', {website: true, path: "tutor", user: req.user, role: role, isStudent: true, studentInfo: studentInfo, tutor: tutor, isProfessor: false, isDean: false, success: req.flash('success'), error: req.flash('error')})
    }

  } catch (error) {
    console.error(error.message);
  }
});

router.get('/students', isLoggedIn, isProfessorUser, async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.usuario_id = estudiante.usuario_id WHERE estudiante.profesor_usuario_id = ?", [req.user.usuario_id])
    console.log("Estudiantes: ", rows);

    res.render('students', {website: true, path: "students", user: req.user, isProfessor: true, students: rows, success: req.flash('success'), error: req.flash('error')});
  } catch(error) {
    console.error(error.message);
  }
});

router.get('/student/:userId', isLoggedIn, isProfessorUser, async (req, res) => {
  try {
    const rows = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.usuario_id = estudiante.usuario_id WHERE estudiante.usuario_id = ?", [req.params.userId]);
    
    if(rows.length > 0) {
      student = rows[0];
      console.log("Estudiante: ", student);

      res.render('student', {website: true, path: "students", user: req.user, isProfessor: true, student: student, success: req.flash('success'), error: req.flash('error')});
    }
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/reports', isLoggedIn, isDeanUser, async (req, res) => {
  try {
    rows = await pool.query("SELECT * FROM reunion_view WHERE estado_id != 5")
    meetings = rows
    console.log("Reuniones: ", rows);
  
    meetingsNum = rows.length
    gpa = await pool.query("SELECT AVG(gpa) as gpa FROM estudiante")
    console.log("GPA: ", gpa);
    userNum = await pool.query("SELECT COUNT(*) as count FROM usuario WHERE first_time_login = 0")
    conditionedNum = await pool.query("SELECT COUNT(*) as count FROM estudiante WHERE gpa < 3")
  
    res.render('reports', {website: true, path: "reports", user: req.user, isDean: true, meetings: meetings, meetingsNum: meetingsNum, gpa: gpa[0].gpa, userNum: userNum[0].count, conditionedNum: conditionedNum[0].count, success: req.flash('success'), error: req.flash('error')})
  
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/notifications', isLoggedIn, isUserStudentOrProfessor, async (req, res) => {
  const rows = await pool.query("SELECT * FROM rol WHERE rol_id = ?", [req.user.rol_id]);

  if(rows.length > 0) {
    role = rows[0];
    const isStudent = (role.nombre === "Estudiante");
    const isProfessor = (role.nombre === "Profesor");
    const isDean = (role.nombre === "Decano");

    res.render('notifications', {website: true, path: "notifications", user: req.user, isDean: isDean, isProfessor: isProfessor, isStudent: isStudent, success: req.flash('success'), error: req.flash('error')})
  }
});

router.post('/notifications', (req, res) => {
  console.log("datos ingresados: ", req.body);

  res.redirect('/notifications')
}); 

module.exports = router; 
