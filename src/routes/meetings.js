const express = require('express');
const pool = require('../database');
const { isLoggedIn, isProfessorUser, isUserStudentOrProfessor } = require('../lib/auth');
const utils = require('../lib/utils');

const router = express.Router();

const deletedStatus = 5;


router.get('/', isLoggedIn, isUserStudentOrProfessor, async (req, res) => {
    try {
      isStudent = false;
      isProfessor = false; 
      studentInfo = {};
      tutor = {};
      students = {};
      meetings = {}
  
      if(req.user.rol_id == 3) {
        isStudent = true;
  
        const rows = await pool.query("SELECT * FROM estudiante_view WHERE id = ?", [req.user.id]);
        studentInfo = rows[0]
  
        const rows2 = await pool.query("SELECT * FROM usuario INNER JOIN profesor on usuario.id = profesor.id INNER JOIN estudiante on profesor.id = estudiante.profesor_id WHERE profesor.id = ?", [studentInfo.profesor_id])
        tutor = rows2[0]
        
        const rows3 = await pool.query("SELECT * FROM reunion_view WHERE estudiante_id = ? and estado_id != ?", [req.user.id, deletedStatus])
        meetings = rows3
  
      } else if (req.user.rol_id == 2) {
        isProfessor = true;
  
        const rows = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.id = estudiante.usuario_id WHERE profesor_id = ?", [req.user.id])
        students = rows;
        
        const rows2 = await pool.query("SELECT * FROM reunion_view WHERE profesor_id = ? and estado_id != ?", [req.user.id, deletedStatus])
        meetings = rows2
      }

      console.log("Reuniones: ", meetings);
      console.log("Is Professor: ", isProfessor);
      console.log("Is Student: ", isStudent);

      meetingsNum = meetings.length

      for(var i = 0; i < meetingsNum; i++) {
        console.log("Reunion: ", meetings[i]);
        var dateTimeValues = getDateTimeValues(meetings[i].fecha)
        meetings[i].fecha = dateTimeValues[0] + " " + dateTimeValues[1] + ":" + dateTimeValues[2] + dateTimeValues[3].text
      }
  
      console.log("Estudiantes: ", students);

      hourValues = utils.getHourValues()
      minuteValues = utils.getMinuteValues()

      const lastIdRow = await pool.query("SELECT * FROM reunion ORDER BY id DESC LIMIT 1")
      
      lastId = 1
      
      if(lastIdRow.length > 0) {
        console.log("Last Reunion: ", lastIdRow);

        lastId = lastIdRow[0].id + 1
  
        console.log("Last Id: ", lastId);
      }
  
      res.render('meetings/list', {path: "meetings", user: req.user, meetings: meetings, isStudent: isStudent, tutor: tutor, studentInfo: studentInfo, isProfessor: isProfessor, students: students, hourValues: hourValues, minuteValues: minuteValues, lastId: lastId, success: req.flash('success'), error: req.flash('error')});
  
    } catch (error) {
      console.error(error.message);
    }
  });

  router.post('/create', async (req, res) => {
    console.log("usuario: ", req.user);
  
    console.log("Datos Ingresados: ", req.body);
  
    dateTime = getDateTimeFormat(req.body.date, req.body.hours, req.body.minutes, req.body.format)
  
    console.log("Date: " + dateTime);
    
    var meetingStatus = 1
  
    try {
      await pool.query("INSERT INTO reunion (tema, descripcion, fecha, profesor_id, estudiante_id, estado_id, created_on, created_by) VALUES (?, ?, ?, ?, ?, ?, now(), ?)", [req.body.subject, req.body.description, dateTime, req.user.id, req.body.student, meetingStatus, req.user.nombres + " " + req.user.apellidos])
      
      req.flash("success", "La reunión fue creada con exito!");
      res.redirect('/meetings');
    } catch (error) {
      console.error(error.message);
    }
    // Create a new meeting
  });

router.get('/delete/:meetingId', isLoggedIn, isProfessorUser, async (req, res) => {

    try {
        await pool.query("UPDATE reunion SET estado_id = ?, updated_on = now(), updated_by = ? WHERE id = ?", [deletedStatus, req.user.id, req.params.meetingId]);

        req.flash('success', 'La reunión fue eliminada con exito');

        res.redirect('/meetings');
    } catch(error) {
        console.error(error.message);
    }
});

router.get('/edit/:meetingId', isLoggedIn, isProfessorUser, async (req, res) => {
    const rows = await pool.query("SELECT * FROM reunion_view WHERE id = ?", [req.params.meetingId]);
    meeting = rows[0];

    dateTime = getDateTimeValues(meeting.fecha)
    console.log("Date Time: ", dateTime);
    date = dateTime[0]
    hours = dateTime[1]
    minutes = dateTime[2]
    format = dateTime[3]

    console.log("Reunion: ", meeting);

    const rows2 = await pool.query("SELECT * FROM usuario INNER JOIN estudiante on usuario.id = estudiante.usuario_id WHERE profesor_id = ?", [req.user.id])
    students = rows2;

    hourValues = utils.getHourValues()
    minuteValues = utils.getMinuteValues()

    res.render('meetings/edit', {path: "meetings", user: req.user, meeting: meeting, date: date, hours: hours, minutes: minutes, format, isStudent: false, isProfessor: true, students: students, hourValues: hourValues, minuteValues: minuteValues, success: req.flash('success'), error: req.flash('error')});
});

router.post('/edit', async (req, res) => {
  console.log("Datos Ingresados: ", req.body);

  dateTime = getDateTimeFormat(req.body.date, req.body.hours, req.body.minutes, req.body.format)

  try{
    var meetingStatus = 2

    console.log("Meeting Status: ", meetingStatus);
    await pool.query("UPDATE reunion SET tema = ?, descripcion = ?, fecha = ?, estudiante_id = ?, estado_id = ?, updated_on = now(), updated_by = ? WHERE id = ?", [req.body.subject, req.body.description, dateTime, req.body.student, meetingStatus, req.user.id, req.body.meetingId])
  
    req.flash('success', 'La reunión fue actualizada con exito!')

    res.redirect('/meetings')
  } catch(error) {
    console.log(error.message);
  }
});

// function to save date into DB
function getDateTimeFormat(date, hours, minutes, format) {
  console.log("Date: ", date);
  console.log("Hours: ", hours);
  console.log("Minutes: ", minutes);
  var dateValues = date.split("/")
  
  var hoursValue = hours

  // Converts PM values to 24 value
  if(format == 2 && hoursValue != "12") {
    hoursValue = String((parseInt(hoursValue[0]) + 12) % 24)
  } else if (format == 1) {
      // Convertas 12 Am to 00 in 24 hour format
      if(hoursValue == "12" && format == 1) {
        hoursValue = "00";
      } else {
        hoursValue = ("0" + hoursValue[0]).slice(-2) 
      }
  }

  var minutesValue = ("0" + minutes).slice(-2)

  // Creates date in standard datetime format YYYY-MM-DD hh:mm'
  var time = hoursValue + ":" + minutesValue;
  var dateTime = dateValues[2] + "-" + dateValues[1] + "-" + dateValues[0] + " " + time

  return dateTime
}

function getDateTimeValues(date) {
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var year = date.getFullYear();
  var dateString = day + "/" + month + "/" + year;

  console.log("Meeting Date: ", dateString);

  var hours = date.getHours()

  var format = {}

  if(hours == 0) {
    hours = 12
    format = {text: "AM", value: 1}
  } else if (hours < 12) {
    format = {text: "AM", value: 1}
  } else {
    if(hours != 12){
      hours = hours - 12
    }
    format = {text: "PM", value: 2}
  }
  var hoursString = String(hours)

  var minutesString = ("0" + date.getMinutes()).slice(-2)

  console.log("Meeting Hours: ", hoursString);
  console.log("Meeting Minutes: ", minutesString);

  return [dateString, hoursString, minutesString, format]
}

module.exports = router;