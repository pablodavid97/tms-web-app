const express = require('express');
const {
  isLoggedIn,
  isNotLoggedIn,
  isDeanUser,
  isProfessorUser,
  isStudentUser,
  isUserStudentOrProfessor
} = require('../lib/auth');

const router = express.Router();
const axiosInstance = require('../http-client');
const utils = require('../lib/utils');

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('auth/signin', {
    path: 'signin',
    pageTitle: 'USFQ Tutorías',
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.get('/home', isLoggedIn, async (req, res) => {
  console.log('Inside the homepage callback function');
  console.log(req.sessionID);
  try {
    console.log('Req: ', user);

    const request = await axiosInstance.get('/home', {
      params: { userId: req.user.id, rolId: req.user.rolId }
    });
    const homeJSON = request.data;

    console.log('Objects: ', homeJSON);

    role = homeJSON.rol;
    const isStudent = role.id === 3;
    const isProfessor = role.id === 2;
    const isDean = role.id === 1;
    tutor = {};
    studentInfo = {};

    if (isStudent) {
      studentInfo = homeJSON.studentInfo;
      tutor = homeJSON.tutor;
    }

    res.render('user-profile', {
      path: 'home',
      user: req.user,
      role,
      isStudent,
      studentInfo,
      tutor,
      isProfessor,
      isDean,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/tutor', isLoggedIn, isStudentUser, async (req, res) => {
  try {
    const request = await axiosInstance.get('/tutor', {
      params: { rolId: req.user.rolId, estudianteId: req.user.id }
    });
    const tutorJSON = request.data;

    console.log('JSON: ', tutorJSON);

    role = tutorJSON.rol;
    studentInfo = tutorJSON.studentInfo;
    tutor = tutorJSON.tutor;

    console.log('Tutor: ', tutor);

    res.render('tutor', {
      path: 'tutor',
      user: req.user,
      role,
      isStudent: true,
      studentInfo,
      tutor,
      isProfessor: false,
      isDean: false,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/students', isLoggedIn, isProfessorUser, async (req, res) => {
  console.log('Got in!');
  try {
    const request = await axiosInstance.get('/students', {
      params: { profesorId: req.user.id }
    });
    const studentsJSON = request.data;

    console.log('Estudiantes: ', studentsJSON);
    students = studentsJSON;

    res.render('students', {
      path: 'students',
      user: req.user,
      isProfessor: true,
      students,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get(
  '/student/:userId',
  isLoggedIn,
  isProfessorUser,
  async (req, res) => {
    try {
      const request = await axiosInstance.get('/student', {
        params: { userId: req.params.userId }
      });
      const studentJSON = request.data;

      console.log('Student JSON: ', studentJSON);

      student = studentJSON.estudiante;
      console.log('Estudiante: ', student);

      res.render('student', {
        path: 'students',
        user: req.user,
        isProfessor: true,
        student,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.get('/reports', isLoggedIn, isDeanUser, async (req, res) => {
  console.log('Entro!');
  try {
    const request = await axiosInstance.get('/reports', {
      params: { decanoId: req.user.id }
    });
    const reportsJSON = request.data;

    console.log('Reports JSON: ', reportsJSON);

    meetings = reportsJSON.reuniones;
    console.log('Reuniones: ', meetings);

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

    gpa = reportsJSON.gpa;
    console.log('GPA: ', gpa);
    userNum = reportsJSON.activeUsers.length;
    conditionedNum = reportsJSON.conditionedUsers.length;

    res.render('reports', {
      path: 'reports',
      user: req.user,
      isDean: true,
      meetings,
      meetingsNum,
      gpa,
      userNum,
      conditionedNum,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get(
  '/notifications',
  isLoggedIn,
  isUserStudentOrProfessor,
  async (req, res) => {
    const request = await axiosInstance.get('/notifications', {
      params: { rolId: req.user.rolId, userId: req.user.id }
    });
    const notificationsJSON = request.data;

    role = notificationsJSON.rol;
    notifications = notificationsJSON.notifications;

    const notificationsNum = notifications.length

    for(i = 0; i < notificationsNum; i++) {
      const dateTimeValues = utils.getDateTimeValues(notifications[i].fecha)
      notifications[i].fecha = 
      dateTimeValues[0] +
      ' ' +
      dateTimeValues[1] +
      ':' +
      dateTimeValues[2] +
      dateTimeValues[3].text;
    }

    console.log('Notificaciones: ', notifications);

    const isStudent = role.id === 3;
    const isProfessor = role.id === 2;
    const isDean = role.id === 1;

    res.render('notifications', {
      path: 'notifications',
      user: req.user,
      notifications: notifications,
      isDean: isDean,
      isProfessor: isProfessor,
      isStudent: isStudent,
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
);

router.post('/notifications', (req, res) => {
  console.log('datos ingresados: ', req.body);

  res.redirect('/notifications');
});

module.exports = router;
