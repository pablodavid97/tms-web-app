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
const upload = require('../middlewares/upload');
const fs = require('fs');

router.get('/', isNotLoggedIn, (req, res) => {
  res.render('auth/signin', {
    path: 'signin',
    pageTitle: 'USFQ Tutorías',
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.get('/home', isLoggedIn, async (req, res) => {
  try {
    console.log("Usuario: ", req.user);

    console.log("Storing user image...");

    fs.writeFileSync(global.appRoot + "/public/img/tmp/" + req.user.nombreImagen, new Buffer.from(req.user.imagen, "binary"))

    console.log("User image has been stored!");

    const request = await axiosInstance.get('/home', {
      params: { userId: req.user.id, rolId: req.user.rolId }
    });
    const homeJSON = request.data;

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

    const notificationsRequest = await axiosInstance.get('/notifications', {
      params: { rolId: req.user.rolId, userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;
  
    notifications = notificationsJSON.notifications;

    res.render('user-profile', {
      path: 'home',
      user: req.user,
      role,
      isStudent,
      studentInfo,
      tutor,
      isProfessor,
      isDean,
      notifications: notifications,
      showNotifications: global.showNotifications,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
})

router.get('/tutor', isLoggedIn, isStudentUser, async (req, res) => {
  try {
    const request = await axiosInstance.get('/tutor', {
      params: { rolId: req.user.rolId, estudianteId: req.user.id }
    });
    const tutorJSON = request.data;

    role = tutorJSON.rol;
    studentInfo = tutorJSON.studentInfo;
    tutor = tutorJSON.tutor;

    fs.writeFileSync(global.appRoot + "/public/img/tmp/" + tutor.nombreImagen, new Buffer.from(tutor.imagen, "binary"))

    const notificationsRequest = await axiosInstance.get('/notifications', {
      params: { rolId: req.user.rolId, userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;
  
    notifications = notificationsJSON.notifications;

    res.render('tutor', {
      path: 'tutor',
      user: req.user,
      role,
      isStudent: true,
      studentInfo,
      tutor,
      isProfessor: false,
      isDean: false,
      notifications: notifications,
      showNotifications: global.showNotifications,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/students', isLoggedIn, isProfessorUser, async (req, res) => {
  try {
    const request = await axiosInstance.get('/students', {
      params: { profesorId: req.user.id }
    });
    const studentsJSON = request.data;
    students = studentsJSON;

    const notificationsRequest = await axiosInstance.get('/notifications', {
      params: { rolId: req.user.rolId, userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;
  
    notifications = notificationsJSON.notifications;
    

    res.render('students', {
      path: 'students',
      user: req.user,
      isProfessor: true,
      students,
      notifications: notifications,
      showNotifications: global.showNotifications,
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

      student = studentJSON.estudiante;

      console.log("Estudiante: ", student);

      fs.writeFileSync(global.appRoot + "/public/img/tmp/" + student.nombreImagen, new Buffer.from(student.imagen, "binary"))

      const notificationsRequest = await axiosInstance.get('/notifications', {
        params: { rolId: req.user.rolId, userId: req.user.id }
      });
      const notificationsJSON = notificationsRequest.data;
    
      notifications = notificationsJSON.notifications;

      res.render('student', {
        path: 'students',
        user: req.user,
        isProfessor: true,
        student: student,
        notifications: notifications,
        showNotifications: global.showNotifications,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.get('/reports', isLoggedIn, isDeanUser, async (req, res) => {
  try {
    const request = await axiosInstance.get('/reports', {
      params: { decanoId: req.user.id }
    });
    const reportsJSON = request.data;

    meetings = reportsJSON.reuniones;
    meetingsNum = meetings.length;

    for (let i = 0; i < meetingsNum; i++) {
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
    if(global.showNotifications) {
      global.showNotifications = false
    }

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
      showNotifications: global.showNotifications,
      success: req.flash('success'),
      error: req.flash('error')
    });
  }
);

router.post('/notifications', async (req, res) => {
  meetingOption = req.body.meetingOption
  notificationId = req.body.notificationId
  meetingId = req.body.meetingId
  profesorId = req.body.profesorId
  comment = req.body.comment
  email = req.user.correoInstitucional

  if (meetingOption === "1") {
    request = await axiosInstance.post('/meetings/accept', {meetingId: meetingId, notificationId: notificationId, comment: comment, profesorId: profesorId, email: email})
  } else {
    request = await axiosInstance.post('/meetings/reject', {meetingId: meetingId, notificationId: notificationId, comment: comment, profesorId: profesorId, email: email})
  }

  res.redirect('/notifications');
});

// EDIT PROFILE
router.get('/edit-profile', isLoggedIn, async (req, res) => {
  const isDean = req.user.rolId === 1
  const isProfessor = req.user.rolId === 2
  const isStudent = req.user.rolId === 3

  const notificationsRequest = await axiosInstance.get('/notifications', {
    params: { rolId: req.user.rolId, userId: req.user.id }
  });
  const notificationsJSON = notificationsRequest.data;

  notifications = notificationsJSON.notifications;

  res.render('edit-profile', {
    user: req.user,
    isDean: isDean,
    isProfessor: isProfessor,
    isStudent: isStudent,
    notifications: notifications,
    showNotifications: global.showNotifications,
    success: req.flash('success'),
    error: req.flash('error')
  })
});

router.post('/edit-profile', isLoggedIn, async (req, res) => {
  try {
    editProfileRequest = await axiosInstance.post('/edit-profile', {firstNames: req.body.userNames, lastNames: req.body.userLastNames, email: req.body.userEmail, phone: req.body.userPhone, userId: req.user.id})
    
    req.flash('success', 'Tus datos han sido actualizados exitosamente!');

    res.redirect('/home')
  } catch (error) {
    console.error(error.message);
  }
})

// CHANGE PASSWORD
router.get('/change-password/', isLoggedIn, async (req, res) => {
  const isDean = req.user.rolId === 1
  const isProfessor = req.user.rolId === 2
  const isStudent = req.user.rolId === 3

  const notificationsRequest = await axiosInstance.get('/notifications', {
    params: { rolId: req.user.rolId, userId: req.user.id }
  });
  const notificationsJSON = notificationsRequest.data;

  notifications = notificationsJSON.notifications;

  res.render('auth/change-password', {
    headerTitle: '¿Quieres Cambiar tu Contraseña?',
    userId: req.user.id,
    createBtnText: 'Cambiar Contraseña',
    user: req.user,
    isDean: isDean,
    isProfessor: isProfessor,
    isStudent: isStudent,
    notifications: notifications,
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.post('/change-password', isLoggedIn, async (req, res) => {
  userId = req.body.userId;
  oldPassword = req.body.oldPassword
  newPassword = req.body.newPassword;
  confirmation = req.body.confirmation;

  passwordsMatch = await utils.matchPassword(oldPassword, req.user.hash)

  if(passwordsMatch){
    if(newPassword === confirmation) {
      newHash = await utils.encryptPassword(newPassword)

      request = await axiosInstance.post('/change-password', {hash: newHash, userId: req.user.id})
      changepwdJSON = request.data

      req.flash('success', 'La contraseña fue cambiada con exito!');
      res.redirect('/home')
    } else {
      req.flash('error', 'La nueva contraseña y confirmación no coinciden.');
      res.redirect('/change-password')
    }
  } else {
    req.flash('error', 'La contraseña ingresada no es la correcta.');
    res.redirect('/change-password')
  }
})

router.get('/upload', (req, res) => {
  res.render('file-upload')
})

router.post('/upload', upload.single("file"), async (req, res) => {
  console.log("Entro!");
  try {
    file = {
      formato: req.file.mimetype,
      nombre: `${Date.now()}-${req.file.originalname}`,
      datos: fs.readFileSync(global.appRoot + '/public/img/uploads/' + req.file.filename).toString("binary"),
      createdOn: new Date()
    }

    uploadRequest = await axiosInstance.post('/upload', {file: file})

    res.redirect('/upload')
    
  } catch (error) {
    console.error(error.message);
  }
})

module.exports = router;
