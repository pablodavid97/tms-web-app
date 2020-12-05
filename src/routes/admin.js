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
const {imageUpload, fileUpload} = require('../lib/upload');
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


router.post('/current-semester', async (req, res) => {
  semesterId = req.body.semester;

  global.currentSemester = semesterId;

  semesterRequest = await axiosInstance.post('/admin/current-semester', {
    semesterId: semesterId
  });

  req.flash('success', `El semestre actual fue actualizado con exito!`);

  res.redirect('/home');
});

router.get('/files-upload',(req, res) => {

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

  res.render('admin/files-upload', {
    path: 'admin-files-upload',
    user: req.user,
    isStudent,
    isProfessor,
    isDean,
    isAdmin,
    success: req.flash('success'),
    error: req.flash('error')
  })
});

router.post('/files-upload', fileUpload.fields([{
    name: 'careersFile', maxCount: 1
  }, {
    name: 'semestersFile', maxCount: 1
  }, {
    name: 'deansFile', maxCount: 1
  }, {
    name: 'professorsFile', maxCount: 1
  }, {
    name: 'studentsFile', maxCount: 1
  }, {
    name: 'adminsFile', maxCount: 1
  }]), async (req, res) => {
  
    console.log("Carreras: ", req.files.careersFile[0]);
    console.log('Semestres: ', req.files.semestersFile[0]);
    console.log("Decanos: ", req.files.deansFile[0]);
    console.log('Profesores: ', req.files.professorsFile[0]);
    console.log("Estudiantes: ", req.files.studentsFile[0]);
    console.log("Administradores: ", req.files.adminsFile[0]);

  let filesNum = Object.keys(req.files).length

  if(filesNum === 6) {
    filesPath = global.appRoot + '/public/tmp/';
    careersPath = filesPath + req.files.careersFile[0].filename
    semestersPath = filesPath + req.files.semestersFile[0].filename
    deansPath = filesPath + req.files.deansFile[0].filename
    professorsPath = filesPath + req.files.professorsFile[0].filename
    studentsPath = filesPath + req.files.studentsFile[0].filename
    adminsPath = filesPath + req.files.adminsFile[0].filename

    careersFile = {
      nombre: req.files.careersFile[0].filename,
      datos: fs.readFileSync(careersPath).toString('binary')
    },
    semestersFile = {
      nombre: req.files.semestersFile[0].filename,
      datos: fs.readFileSync(semestersPath).toString('binary')
    },
    deansFile = {
      nombre: req.files.deansFile[0].filename,
      datos: fs.readFileSync(deansPath).toString('binary')
    },
    professorsFile = {
      nombre: req.files.professorsFile[0].filename,
      datos: fs.readFileSync(professorsPath).toString('binary')
    },
    studentsFile = {
      nombre: req.files.studentsFile[0].filename, 
      datos: fs.readFileSync(studentsPath).toString('binary'),
    },
    adminsFile = {
      nombre: req.files.adminsFile[0].filename,
      datos: fs.readFileSync(adminsPath).toString('binary')
    },

    files = {careers: careersFile, semesters: semestersFile, deans: deansFile, professors: professorsFile, students: studentsFile, admins: adminsFile}

    console.log("Files: ", files);

    console.log("Submitting files into database...");

    filesRequest = await axiosInstance.post('/admin/files-upload', {files: files})
    filesJSON = filesRequest.data

    console.log("Files where submitted!");

    console.log('Deleting created files from system...');

    // removes file after saved into DB
    fs.unlinkSync(careersPath)
    fs.unlinkSync(semestersPath)
    fs.unlinkSync(deansPath)
    fs.unlinkSync(professorsPath)
    fs.unlinkSync(studentsPath)
    fs.unlinkSync(adminsPath)

    console.log('Files has been deleted from system');

    req.flash('success', 'Los datos se ingresaron con exito!');

    res.redirect('/home');
  } else {
    req.flash('error', 'Error: Se deben subir todos los archivos al sistema');

    res.redirect('/admin/files-upload');
  }
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

router.post('/upload', imageUpload.single('file'), async (req, res) => {
  try {
    console.log("Datos Ingresados: ", req.body);
    
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


module.exports = router;
