const express = require('express');
const {
  isLoggedIn,
  isNotLoggedIn,
  isDeanUser,
  isProfessorUser,
  isStudentUser,
  isUserStudentOrProfessor,
  isAdminUser
} = require('../lib/auth');

const router = express.Router();
const axiosInstance = require('../http-client');
const utils = require('../lib/utils');
const { imageUpload, fileUpload } = require('../lib/upload');
const fs = require('fs');

router.get('/', isLoggedIn, isAdminUser, async (req, res) => {
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
  careers = adminJSON.careers;

  careers.sort((a, b) => {
    return a.carrera.localeCompare(b.carrera);
  });

  console.log('Carreras: ', careers);

  res.render('admin/home', {
    path: 'admin-home',
    user: req.user,
    users,
    semesters,
    careers,
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

router.get('/files-upload', isLoggedIn, isAdminUser, (req, res) => {
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
  });
});

router.post(
  '/files-upload',
  fileUpload.fields([
    {
      name: 'careersFile',
      maxCount: 1
    },
    {
      name: 'semestersFile',
      maxCount: 1
    },
    {
      name: 'deansFile',
      maxCount: 1
    },
    {
      name: 'professorsFile',
      maxCount: 1
    },
    {
      name: 'studentsFile',
      maxCount: 1
    },
    {
      name: 'gpasFile',
      maxCount: 1
    },
    {
      name: 'adminsFile',
      maxCount: 1
    }
  ]),
  async (req, res) => {
    let filesNum = Object.keys(req.files).length;

    if (filesNum === 7) {
      console.log('Carreras: ', req.files.careersFile[0]);
      console.log('Semestres: ', req.files.semestersFile[0]);
      console.log('Decanos: ', req.files.deansFile[0]);
      console.log('Profesores: ', req.files.professorsFile[0]);
      console.log('Estudiantes: ', req.files.studentsFile[0]);
      console.log('Gpas: ', req.files.gpasFile[0]);
      console.log('Administradores: ', req.files.adminsFile[0]);

      filesPath = global.appRoot + '/public/tmp/';
      careersPath = filesPath + req.files.careersFile[0].filename;
      semestersPath = filesPath + req.files.semestersFile[0].filename;
      deansPath = filesPath + req.files.deansFile[0].filename;
      professorsPath = filesPath + req.files.professorsFile[0].filename;
      studentsPath = filesPath + req.files.studentsFile[0].filename;
      gpasPath = filesPath + req.files.gpasFile[0].filename;
      adminsPath = filesPath + req.files.adminsFile[0].filename;

      (careersFile = {
        nombre: req.files.careersFile[0].filename,
        datos: fs.readFileSync(careersPath).toString('binary')
      }),
        (semestersFile = {
          nombre: req.files.semestersFile[0].filename,
          datos: fs.readFileSync(semestersPath).toString('binary')
        }),
        (deansFile = {
          nombre: req.files.deansFile[0].filename,
          datos: fs.readFileSync(deansPath).toString('binary')
        }),
        (professorsFile = {
          nombre: req.files.professorsFile[0].filename,
          datos: fs.readFileSync(professorsPath).toString('binary')
        }),
        (studentsFile = {
          nombre: req.files.studentsFile[0].filename,
          datos: fs.readFileSync(studentsPath).toString('binary')
        }),
        (gpasFile = {
          nombre: req.files.gpasFile[0].filename,
          datos: fs.readFileSync(gpasPath).toString('binary')
        }),
        (adminsFile = {
          nombre: req.files.adminsFile[0].filename,
          datos: fs.readFileSync(adminsPath).toString('binary')
        }),
        (files = {
          careers: careersFile,
          semesters: semestersFile,
          deans: deansFile,
          professors: professorsFile,
          students: studentsFile,
          gpas: gpasFile,
          admins: adminsFile
        });

      console.log('Files: ', files);

      console.log('Submitting files into database...');

      filesRequest = await axiosInstance.post('/admin/files-upload', {
        files: files
      });
      filesJSON = filesRequest.data;

      console.log('Files where submitted!');

      console.log('Deleting created files from system...');

      // removes file after saved into DB
      fs.unlinkSync(careersPath);
      fs.unlinkSync(semestersPath);
      fs.unlinkSync(deansPath);
      fs.unlinkSync(professorsPath);
      fs.unlinkSync(studentsPath);
      fs.unlinkSync(adminsPath);

      console.log('Files has been deleted from system');

      req.flash('success', 'Los datos se ingresaron con exito!');

      res.redirect('/home');
    } else {
      req.flash('error', 'Error: Se deben subir todos los archivos al sistema');

      res.redirect('/admin/files-upload');
    }
  }
);

router.get('/upload', isLoggedIn, isAdminUser, (req, res) => {
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
    console.log('Datos Ingresados: ', req.body);

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

router.get('/users', isLoggedIn, isAdminUser, async (req, res) => {
  try {
    let usersRequest = await axiosInstance.get('/admin/users');
    let usrsJSON = usersRequest.data;

    let users = usrsJSON.users;

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

    res.render('admin/users', {
      path: 'admin-users',
      user: req.user,
      users: users,
      isStudent,
      isProfessor,
      isDean,
      isAdmin,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/edit-user/:userId', isLoggedIn, isAdminUser, async (req, res) => {
  try {
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

    let userRequest = await axiosInstance.get('/user-by-id', {
      params: { userId: req.params.userId }
    });
    let userJSON = userRequest.data;
    let userToEdit = userJSON;

    if (userToEdit.imagenId) {
      const imageRequest = await axiosInstance.get('/image-by-id', {
        params: { imageId: userToEdit.imagenId }
      });
      imageJSON = imageRequest.data;

      userToEdit.imagen = imageJSON;

      console.log('Usuario: ', userToEdit);

      fs.writeFileSync(
        global.appRoot + '/public/img/tmp/' + userToEdit.imagen.nombre,
        new Buffer.from(userToEdit.imagen.datos, 'binary')
      );
    }

    res.render('admin/edit-user', {
      path: 'admin-users',
      user: req.user,
      userToEdit,
      isStudent,
      isProfessor,
      isDean,
      isAdmin,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/edit-user', imageUpload.single('file'), async (req, res) => {
  try {
    file = undefined;
    if (req.file) {
      filePath = global.appRoot + '/public/img/uploads/' + req.file.filename;
      file = {
        formato: req.file.mimetype,
        nombre: `${Date.now()}-${req.file.originalname}`,
        datos: fs.readFileSync(filePath).toString('binary'),
        uploadedOn: new Date()
      };

      console.log('Deleting created file from system...');

      // removes file after saved into DB
      fs.unlinkSync(filePath);

      console.log('File has been deleted');
    }

    editUserRequest = await axiosInstance.post('/admin/edit-user', {
      code: req.body.userCode,
      email: req.body.userEmail,
      firstNames: req.body.userNames,
      lastNames: req.body.userLastNames,
      personalEmail: req.body.userPersonalEmail,
      phone: req.body.userPhone,
      userId: req.body.userId,
      file: file
    });
    editUserJSON = editUserRequest.data;

    req.flash('success', 'Los datos del usuario fueron actualizados!');

    res.redirect('/admin');
  } catch (error) {
    console.error(error.message);
  }
});

router.get(
  '/delete-user/:userId',
  isLoggedIn,
  isAdminUser,
  async (req, res) => {
    try {
      let userId = req.params.userId;

      let deleteRequest = await axiosInstance.post('/admin/delete-user', {
        userId: userId
      });
      let deleteJSON = deleteRequest.data;

      req.flash('success', `El usuario fue eliminado con exito!`);

      res.redirect('/admin/users');
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.post(
  '/add-users',
  fileUpload.fields([
    {
      name: 'deansFile',
      maxCount: 1
    },
    {
      name: 'professorsFile',
      maxCount: 1
    },
    {
      name: 'studentsFile',
      maxCount: 1
    },
    {
      name: 'adminsFile',
      maxCount: 1
    }
  ]),
  async (req, res) => {
    filesPath = global.appRoot + '/public/tmp/';
    deansPath = undefined;
    professorsPath = undefined;
    studentsPath = undefined;
    adminsPath = undefined;
    deansFile = undefined;
    professorsFile = undefined;
    studentsFile = undefined;
    adminsFile = undefined;

    let filesNum = Object.keys(req.files).length;

    if (filesNum >= 1) {
      if (req.files.deansFile) {
        deansPath = filesPath + req.files.deansFile[0].filename;
        deansFile = {
          nombre: req.files.deansFile[0].filename,
          datos: fs.readFileSync(deansPath).toString('binary')
        };
      }

      if (req.files.professorsFile) {
        professorsPath = filesPath + req.files.professorsFile[0].filename;
        professorsFile = {
          nombre: req.files.professorsFile[0].filename,
          datos: fs.readFileSync(professorsPath).toString('binary')
        };
      }

      if (req.files.studentsFile) {
        studentsPath = filesPath + req.files.studentsFile[0].filename;
        studentsFile = {
          nombre: req.files.studentsFile[0].filename,
          datos: fs.readFileSync(studentsPath).toString('binary')
        };
      }

      if (req.files.adminsFile) {
        adminsPath = filesPath + req.files.adminsFile[0].filename;
        adminsFile = {
          nombre: req.files.adminsFile[0].filename,
          datos: fs.readFileSync(adminsPath).toString('binary')
        };
      }

      files = {
        deans: deansFile,
        professors: professorsFile,
        students: studentsFile,
        admins: adminsFile
      };

      console.log('Files: ', files);

      console.log('Submitting files into database...');

      filesRequest = await axiosInstance.post('/admin/add-users', {
        files: files
      });
      filesJSON = filesRequest.data;

      console.log('Files where submitted!');

      console.log('Deleting created files from system...');

      // removes file after saved into DB

      if (deansPath) {
        fs.unlinkSync(deansPath);
      }

      if (professorsPath) {
        fs.unlinkSync(professorsPath);
      }

      if (studentsPath) {
        fs.unlinkSync(studentsPath);
      }

      if (adminsPath) {
        fs.unlinkSync(adminsPath);
      }

      console.log('Files has been deleted from system');

      req.flash('success', `Se agregó/(aron) el/los usuario(s) con exito!`);
      res.redirect('/admin');
    } else {
      req.flash('error', 'Error: Se debe subir por lo menos un archivo');
      res.redirect('/admin/users');
    }
  }
);

router.get('/additional-files', isLoggedIn, isAdminUser, async (req, res) => {
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

  res.render('admin/additional-files', {
    path: 'admin-additional-files',
    user: req.user,
    isStudent,
    isProfessor,
    isDean,
    isAdmin,
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.post(
  '/additional-files',
  fileUpload.fields([
    {
      name: 'careersFile',
      maxCount: 1
    },
    {
      name: 'semestersFile',
      maxCount: 1
    },
    {
      name: 'gpasFile',
      maxCount: 1
    }
  ]),
  async (req, res) => {
    const filesPath = global.appRoot + '/public/tmp/';
    let careersPath = undefined;
    let semestersPath = undefined;
    let gpasPath = undefined;
    let careersFile = undefined;
    let semestersFile = undefined;
    let gpasFile = undefined;

    let filesNum = Object.keys(req.files).length;

    if (filesNum >= 1) {
      if (req.files.careersFile) {
        careersPath = filesPath + req.files.careersFile[0].filename;
        careersFile = {
          nombre: req.files.careersFile[0].filename,
          datos: fs.readFileSync(careersPath).toString('binary')
        };
      }

      if (req.files.semestersFile) {
        semestersPath = filesPath + req.files.semestersFile[0].filename;
        semestersFile = {
          nombre: req.files.semestersFile[0].filename,
          datos: fs.readFileSync(semestersPath).toString('binary')
        };
      }

      if (req.files.gpasFile) {
        gpasPath = filesPath + req.files.gpasFile[0].filename;
        gpasFile = {
          nombre: req.files.gpasFile[0].filename,
          datos: fs.readFileSync(gpasPath).toString('binary')
        };
      }

      let files = {
        careers: careersFile,
        semesters: semestersFile,
        gpas: gpasFile
      };

      filesRequest = await axiosInstance.post('/admin/additional-files', {
        files: files
      });
      filesJSON = filesRequest.data;

      console.log('Files where submitted!');

      console.log('Deleting created files from system...');

      // removes file after saved into DB

      if (careersPath) {
        fs.unlinkSync(careersPath);
      }

      if (semestersPath) {
        fs.unlinkSync(semestersPath);
      }

      if (gpasPath) {
        fs.unlinkSync(gpasPath);
      }

      console.log('Files has been deleted from system');

      req.flash('success', `Se agregaron los archivos con exito!`);
      res.redirect('/admin');
    } else {
      req.flash('error', 'Error: Se debe subir por lo menos un archivo');
      res.redirect('/admin/additional-files');
    }
  }
);

module.exports = router;
