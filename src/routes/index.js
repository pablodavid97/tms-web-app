const express = require('express');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn, isDeanUser, isProfessorUser, isStudentUser, isUserStudentOrProfessor } = require('../lib/auth');
const router = express.Router();
const axios = require('axios')

// Axios instance configurations
const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:3000',
});

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('auth/signin', {website: true, path: "signin", pageTitle: "USFQ Tutorías", success: req.flash('success'), error: req.flash('error')});
});

router.get('/home', isLoggedIn, async (req, res) => {
  try{
    // const data = {"userId": String(req.user.id), "rolId": String(req.user.rol_id)}
    // console.log("DAta: ", data);
    const request = await axiosInstance.get('/home', {params: {userId: req.user.id, rolId: req.user.rol_id}})
    const homeJSON = request.data

    console.log("Objects: ", homeJSON);
  
    role = homeJSON.rol;
    const isStudent = (role.id === 3);
    const isProfessor = (role.id === 2);
    const isDean = (role.id === 1);
    tutor = {}
    studentInfo = {}

    if (isStudent) {
      studentInfo = homeJSON.studentInfo
      tutor = homeJSON.tutor
    }

    res.render('user-profile', {website: true, path: "home", user: req.user, role: role, isStudent: isStudent, studentInfo: studentInfo, tutor: tutor, isProfessor: isProfessor, isDean: isDean, success: req.flash('success'), error: req.flash('error')});
  
  } catch (error) {
    console.error(error.message);
  }

});

router.get('/tutor', isLoggedIn, isStudentUser, async (req, res) => {
  try {
    const request = await axiosInstance.get('/tutor', {params: {rolId: req.user.rol_id, estudianteId: req.user.id}})
    const tutorJSON = request.data

    console.log("JSON: ", tutorJSON);

    role = tutorJSON.rol
    studentInfo = tutorJSON.studentInfo
    tutor = tutorJSON.tutor

    console.log("Tutor: ", tutor);


    res.render('tutor', {website: true, path: "tutor", user: req.user, role: role, isStudent: true, studentInfo: studentInfo, tutor: tutor, isProfessor: false, isDean: false, success: req.flash('success'), error: req.flash('error')})

  } catch (error) {
    console.error(error.message);
  }
});

router.get('/students', isLoggedIn, isProfessorUser, async (req, res) => {
  console.log("Got in!");
  try {
    const request = await axiosInstance.get('/students', {params: {profesorId: req.user.id}})
    const studentsJSON = request.data

    console.log("Estudiantes: ", studentsJSON);
    students = studentsJSON.estudiantes

    res.render('students', {website: true, path: "students", user: req.user, isProfessor: true, students: students, success: req.flash('success'), error: req.flash('error')});
  } catch(error) {
    console.error(error.message);
  }
});

router.get('/student/:userId', isLoggedIn, isProfessorUser, async (req, res) => {
  try {
    const request = await axiosInstance.get('/student', {params: {userId: req.params.userId}});
    const studentJSON = request.data

    console.log("Student JSON: ", studentJSON);

    student = studentJSON.estudiante;
    console.log("Estudiante: ", student);

    res.render('student', {website: true, path: "student", user: req.user, isProfessor: true, student: student, success: req.flash('success'), error: req.flash('error')});
 
    
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/reports', isLoggedIn, isDeanUser, async (req, res) => {
  console.log("Entro!");
  try {
    const request = await axiosInstance.get('/reports', {params: {decanoId: req.user.id}})
    const reportsJSON = request.data

    console.log("Reports JSON: ", reportsJSON);

    meetings = reportsJSON.reuniones
    console.log("Reuniones: ", meetings);
  
    meetingsNum = meetings.length

    gpa = reportsJSON.gpa
    console.log("GPA: ", gpa);
    userNum = reportsJSON.activeUsers.length
    conditionedNum = reportsJSON.conditionedUsers.length
  
    res.render('reports', {website: true, path: "reports", user: req.user, isDean: true, meetings: meetings, meetingsNum: meetingsNum, gpa: gpa, userNum: userNum, conditionedNum: conditionedNum, success: req.flash('success'), error: req.flash('error')})
  
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/notifications', isLoggedIn, isUserStudentOrProfessor, async (req, res) => {
  const request = await axiosInstance.get('/notifications', {params: {rolId: req.user.rol_id}})
  const notificationsJSON = request.data

  console.log("rol: ", notificationsJSON);

  role = notificationsJSON.rol

  const isStudent = (role.id === 3);
  const isProfessor = (role.id === 2);
  const isDean = (role.id === 1);

  res.render('notifications', {website: true, path: "notifications", user: req.user, isDean: isDean, isProfessor: isProfessor, isStudent: isStudent, success: req.flash('success'), error: req.flash('error')})

});

router.post('/notifications', (req, res) => {
  console.log("datos ingresados: ", req.body);

  res.redirect('/notifications')
}); 

module.exports = router; 
