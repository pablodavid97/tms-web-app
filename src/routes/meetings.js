const express = require('express');
const pool = require('../database');
const {
  isLoggedIn,
  isProfessorUser,
  isUserStudentOrProfessor
} = require('../lib/auth');
const utils = require('../lib/utils');

const router = express.Router();
const axiosInstance = require('../http-client');

router.get('/', isLoggedIn, isUserStudentOrProfessor, async (req, res) => {
  try {
    const request = await axiosInstance.get('/meetings', {
      params: { rolId: req.user.rolId, userId: req.user.id }
    });
    const meetingsJSON = request.data;

    isStudent = req.user.rolId === 3;
    isProfessor = req.user.rolId === 2;
    studentInfo = meetingsJSON.studentInfo;
    tutor = meetingsJSON.tutor;
    students = meetingsJSON.students;
    meetings = meetingsJSON.meetings;
    lastRowId = meetingsJSON.lastRowId;

    console.log('Reuniones: ', meetings);
    console.log('Is Professor: ', isProfessor);
    console.log('Is Student: ', isStudent);

    meetingsNum = meetings.length;

    for (let i = 0; i < meetingsNum; i++) {
      console.log('Reunion: ', meetings[i]);
      console.log('Fecha: ', meetings[i].fecha);
      const dateTimeValues = utils.getDateTimeValues(meetings[i].fecha);
      meetings[i].fecha =
        dateTimeValues[0] +
        ' ' +
        dateTimeValues[1] +
        ':' +
        dateTimeValues[2] +
        dateTimeValues[3].text;
    }

    console.log('Estudiantes: ', students);

    hourValues = utils.getHourValues();
    minuteValues = utils.getMinuteValues();

    lastId = 0;

    if (lastRowId > 0) {
      console.log('Last Reunion: ', lastRowId);

      lastId = lastRowId + 1;

      console.log('Last Id: ', lastId);
    }

    res.render('meetings/list', {
      path: 'meetings',
      user: req.user,
      meetings,
      isStudent,
      tutor,
      studentInfo,
      isProfessor,
      students,
      hourValues,
      minuteValues,
      lastId,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/create', async (req, res) => {
  console.log('usuario: ', req.user);

  console.log('Datos Ingresados: ', req.body);

  dateTime = utils.getDateTimeFormat(
    req.body.date,
    req.body.hours,
    req.body.minutes,
    req.body.format
  );

  console.log(`Date: ${dateTime}`);

  try {
    request = await axiosInstance.post('/meetings/create', {
      subject: req.body.subject,
      description: req.body.description,
      date: dateTime,
      professorId: req.user.id,
      studentId: req.body.student,
      email: req.user.correoInstitucional
    });
    meetingJSON = request.data;

    console.log('meeting created: ', meetingJSON);

    req.flash('success', 'La reunión fue creada con exito!');
    res.redirect('/meetings');
  } catch (error) {
    console.error(error.message);
  }
  // Create a new meeting
});

router.get(
  '/delete/:meetingId',
  isLoggedIn,
  isProfessorUser,
  async (req, res) => {
    try {
      request = await axiosInstance.post('/meetings/delete', {
        meetingId: req.params.meetingId,
        email: req.user.correoInstitucional
      });
      deleteJSON = request.data;

      console.log('Delete Response: ', deleteJSON);

      req.flash('success', 'La reunión fue eliminada con exito');

      res.redirect('/meetings');
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.get(
  '/edit/:meetingId',
  isLoggedIn,
  isProfessorUser,
  async (req, res) => {
    try {
      request = await axiosInstance.get('/meetings/meeting-by-id', {
        params: { meetingId: req.params.meetingId }
      });
      editMeetingJSON = request.data;

      meeting = editMeetingJSON;

      dateTime = utils.getDateTimeValues(meeting.fecha);
      console.log('Date Time: ', dateTime);
      date = dateTime[0];
      hours = dateTime[1];
      minutes = dateTime[2];
      format = dateTime[3];

      console.log('Reunion: ', meeting);

      request2 = await axiosInstance.get('/students', {
        params: { profesorId: req.user.id }
      });
      studentsJSON = request2.data;

      console.log('Students: ', studentsJSON);

      students = studentsJSON;
      hourValues = utils.getHourValues();
      minuteValues = utils.getMinuteValues();

      console.log('Request test');

      res.render('meetings/edit', {
        path: 'meetings',
        user: req.user,
        meeting,
        date,
        hours,
        minutes,
        format,
        isStudent: false,
        isProfessor: true,
        students,
        hourValues,
        minuteValues,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.post('/edit', async (req, res) => {
  console.log('Datos Ingresados: ', req.body);

  dateTime = utils.getDateTimeFormat(
    req.body.date,
    req.body.hours,
    req.body.minutes,
    req.body.format
  );

  try {
    request = await axiosInstance.post('/meetings/edit', {
      subject: req.body.subject,
      description: req.body.description,
      date: dateTime,
      studentId: req.body.student,
      email: req.user.correoInstitucional,
      meetingId: req.body.meetingId
    });
    editMeetingJSON = request.data;

    console.log('Response: ', editMeetingJSON);

    req.flash('success', 'La reunión fue actualizada con exito!');

    res.redirect('/meetings');
  } catch (error) {
    console.log(error.message);
  }
});

module.exports = router;
