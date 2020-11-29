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
const upload = require('../lib/upload');
const fs = require('fs');

router.get('/', async (req, res) => {
  let isStudent = false;
  let isProfessor = false;
  let isDean = false;
  let isAdmin = false;

  for (rol of req.user.roles) {
    if (rol.rolId === 1) {
      isDean = true;
    }

    if (rol.rolId === 2) {
      isProfessor = true;
    }

    if (rol.rolId === 3) {
      isStudent = true;
    }

    if (rol.rolId === 4) {
      isAdmin = true;
    }
  }

  adminRequest = await axiosInstance.get('/admin');
  adminJSON = adminRequest.data;

  users = adminJSON.users;
  semesters = adminJSON.semesters;

  console.log("Semesters: ", semesters);

  res.render('admin/home', {
    path: 'admin-home',
    user: req.user,
    users,
    semesters,
    isStudent,
    isProfessor,
    isDean,
    isAdmin,
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.get('/upload', (req, res) => {
  let isStudent = false;
  let isProfessor = false;
  let isDean = false;
  let isAdmin = false;

  for (rol of req.user.roles) {
    if (rol.rolId === 1) {
      isDean = true;
    }

    if (rol.rolId === 2) {
      isProfessor = true;
    }

    if (rol.rolId === 3) {
      isStudent = true;
    }

    if (rol.rolId === 4) {
      isAdmin = true;
    }
  }

  res.render('admin/file-upload', {
    path: 'admin-img-upload',
    user: req.user,
    isStudent,
    isProfessor,
    isDean,
    isAdmin,
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    file = {
      formato: req.file.mimetype,
      nombre: `${Date.now()}-${req.file.originalname}`,
      datos: fs
        .readFileSync(
          global.appRoot + '/public/img/uploads/' + req.file.filename
        )
        .toString('binary'),
      uploadedOn: new Date()
    };

    uploadRequest = await axiosInstance.post('/admin/upload', { file: file });

    req.flash('success', `La imagen fue subida con exito!`);

    res.redirect('/admin');
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/current-semester', async (req, res) => {
  console.log("Datos ingresados: ", req.body);

  semesterId = req.body.semester

  global.currentSemester = semesterId

  semesterRequest = await axiosInstance.post('/admin/current-semester', {semesterId: semesterId})

  req.flash('success', `El semestre actual fue actualizado con exito!`);

  res.redirect('/home')
})

module.exports = router;
