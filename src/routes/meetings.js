const express = require('express');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

const router = express.Router();


router.get('/', async (req, res) => {
    try {
      isStudent = false;
      isProfessor = false; 
      studentInfo = {};
      tutor = {};
      students = {};
      meetings = {}
  
      if(req.user.rol_id == 3) {
        isStudent = true;
  
        const rows = await pool.query("SELECT * FROM estudiante WHERE usuario_id = ?", [req.user.usuario_id]);
        studentInfo = rows[0]
  
        const rows2 = await pool.query("SELECT * FROM usuario INNER JOIN profesor on usuario.usuario_id = profesor.usuario_id INNER JOIN estudiante on profesor.usuario_id = estudiante.profesor_usuario_id WHERE profesor.usuario_id = ?", [studentInfo.profesor_usuario_id])
        tutor = rows2[0]
  
        const rows3 = await pool.query("SELECT * FROM reunion_view WHERE estudiante_usuario_id = ?", [req.user.usuario_id])
        meetings = rows3
        console.log("Reuniones: ", meetings);
  
      } else if (req.user.rol_id == 2) {
        isProfessor = true;
  
        const rows = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.usuario_id = estudiante.usuario_id WHERE profesor_usuario_id = ?", [req.user.usuario_id])
        students = rows;
  
        const rows2 = await pool.query("SELECT * FROM reunion_view WHERE profesor_usuario_id = ?", [req.user.usuario_id])
        meetings = rows2
        console.log("Reuniones: ", meetings);
      }
  
      console.log("Estudiantes: ", students);
  
      res.render('meetings/list', {website: true, user: req.user, meetings: meetings, isStudent: isStudent, tutor: tutor, studentInfo: studentInfo, isProfessor: isProfessor, students: students, success: req.flash('success'), error: req.flash('error')});
  
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

router.get('/delete/:meetingId', async (req, res) => {

    try {
        await pool.query("DELETE FROM reunion WHERE reunion_id = ?", [req.params.meetingId]);

        req.flash('success', 'La reunión fue eliminada con exito');

        res.redirect('/meetings');
    } catch(error) {
        console.error(error.message);
    }
});

router.get('/edit/:meetingId', async (req, res) => {
    const rows = await pool.query("SELECT * FROM reunion_view WHERE reunion_id = ?", [req.params.meetingId]);
    meeting = rows[0];

    var month = meeting.fecha.getMonth() + 1;
    var day = meeting.fecha.getDate();
    var year = meeting.fecha.getFullYear();
    var date = day + "/" + month + "/" + year;

    console.log("Meeting Date: ", date);

    var hours = meeting.fecha.getHours();
    var minutes = meeting.fecha.getMinutes();
    var time = ("0" + hours).slice(-2)  + ":" + ("0" + minutes).slice(-2);

    console.log("Meeting Time: ", time);

    console.log("Reunion: ", meeting);

    const rows2 = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.usuario_id = estudiante.usuario_id WHERE profesor_usuario_id = ?", [req.user.usuario_id])
    students = rows2;

    res.render('meetings/edit', {website: true, user: req.user, meeting: meeting, date: date, time: time, isStudent: false, isProfessor: true, students: students, success: req.flash('success'), error: req.flash('error')});
});

module.exports = router;