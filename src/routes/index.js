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
    console.log("User: ", req.user);
    console.log("Storing user image...");

    fs.writeFileSync(global.appRoot + "/public/img/tmp/" + req.user.nombreImagen, new Buffer.from(req.user.imagen, "binary"))

    console.log("User image has been stored!");

    const request = await axiosInstance.get('/home', {
      params: { userId: req.user.id, userRoles: req.user.roles}
    });
    const homeJSON = request.data;

    let isStudent = false
    let isProfessor = false
    let isDean = false
    let isAdmin = false

    for (rol of req.user.roles) {
      if(rol.rolId === 1) {
        isDean = true
      }

      if(rol.rolId === 2) {
        isProfessor = true
      }

      if(rol.rolId === 3) {
        isStudent = true
      }

      if(rol.rolId === 4) {
        isAdmin = true
      }
    }

    console.log("Roles (dean, prof, estud, admin): ", isDean, isProfessor, isStudent, isAdmin);

    gpa = 0
    tutor = {};
    studentInfo = {};
    gpaList = {};

    if (isStudent) {
      studentInfo = homeJSON.studentInfo;
      tutor = homeJSON.tutor;
      gpa = homeJSON.gpa;
      gpaList = homeJSON.gpaList
    }

    const notificationsRequest = await axiosInstance.get('/active-notifications', {
      params: { userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;
  
    notificationsNum = notificationsJSON.notifications.length;

    if(notificationsNum === 0) {
      global.showNotifications = false
    }

    res.render('user-profile', {
      path: 'home',
      user: req.user,
      studentInfo,
      tutor,
      gpa,
      gpaList,
      isStudent,
      isProfessor,
      isDean,
      isAdmin,
      notificationsNum: notificationsNum,
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
    let isStudent = false
    let isProfessor = false
    let isDean = false
    let isAdmin = false

    for (rol of req.user.roles) {
      if(rol.rolId === 1) {
        isDean = true
      }

      if(rol.rolId === 2) {
        isProfessor = true
      }

      if(rol.rolId === 3) {
        isStudent = true
      }

      if(rol.rolId === 4) {
        isAdmin = true
      }
    }

    const request = await axiosInstance.get('/tutor', {
      params: { estudianteId: req.user.id }
    });
    const tutorJSON = request.data;

    studentInfo = tutorJSON.studentInfo;
    tutor = tutorJSON.tutor;

    fs.writeFileSync(global.appRoot + "/public/img/tmp/" + tutor.nombreImagen, new Buffer.from(tutor.imagen, "binary"))

    const notificationsRequest = await axiosInstance.get('/active-notifications', {
      params: { userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;
  
    notificationsNum = notificationsJSON.notifications.length;

    
    res.render('tutor', {
      path: 'tutor',
      user: req.user,
      isStudent,
      studentInfo,
      tutor,
      isProfessor,
      isDean,
      isAdmin,
      notificationsNum: notificationsNum,
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
    let isStudent = false
    let isProfessor = false
    let isDean = false
    let isAdmin = false

    for (rol of req.user.roles) {
      if(rol.rolId === 1) {
        isDean = true
      }

      if(rol.rolId === 2) {
        isProfessor = true
      }

      if(rol.rolId === 3) {
        isStudent = true
      }

      if(rol.rolId === 4) {
        isAdmin = true
      }
    }

    const request = await axiosInstance.get('/students', {
      params: { profesorId: req.user.id }
    });
    const studentsJSON = request.data;

    students = studentsJSON.estudiantes;

    console.log("Estudiantes: ", students);

    const notificationsRequest = await axiosInstance.get('/active-notifications', {
      params: { userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;
  
    notificationsNum = notificationsJSON.notifications.length;
    

    res.render('students', {
      path: 'students',
      user: req.user,
      isProfessor,
      isDean,
      isStudent,
      isAdmin,
      students,
      notificationsNum: notificationsNum,
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
      let isStudent = false
      let isProfessor = false
      let isDean = false
      let isAdmin = false
  
      for (rol of req.user.roles) {
        if(rol.rolId === 1) {
          isDean = true
        }
  
        if(rol.rolId === 2) {
          isProfessor = true
        }
  
        if(rol.rolId === 3) {
          isStudent = true
        }
  
        if(rol.rolId === 4) {
          isAdmin = true
        }
      }

      const request = await axiosInstance.get('/student', {
        params: { userId: req.params.userId }
      });
      const studentJSON = request.data;

      student = studentJSON.estudiante;
      gpa = studentJSON.gpa
      gpaList = studentJSON.gpaList

      fs.writeFileSync(global.appRoot + "/public/img/tmp/" + student.nombreImagen, new Buffer.from(student.imagen, "binary"))

      const notificationsRequest = await axiosInstance.get('/active-notifications', {
        params: { userId: req.user.id }
      });
      const notificationsJSON = notificationsRequest.data;
    
      notificationsNum = notificationsJSON.notifications.length;

      res.render('student', {
        path: 'students',
        user: req.user,
        isDean,
        isProfessor,
        isStudent,
        isAdmin,
        student: student,
        gpa,
        gpaList,
        notificationsNum: notificationsNum,
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
    let isStudent = false
    let isProfessor = false
    let isDean = false
    let isAdmin = false

    for (rol of req.user.roles) {
      if(rol.rolId === 1) {
        isDean = true
      }

      if(rol.rolId === 2) {
        isProfessor = true
      }

      if(rol.rolId === 3) {
        isStudent = true
      }

      if(rol.rolId === 4) {
        isAdmin = true
      }
    }

    const request = await axiosInstance.get('/reports');
    const reportsJSON = request.data;

    meetings = reportsJSON.reuniones;
    meetingsNum = meetings.length;

    // Fixes meeting date format 
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
    conditionedNum = reportsJSON.conditionedUsersNum;

    // deleted meetings
    reunionesEliminadas = reportsJSON.reunionesEliminadas
    reunionesEliminadasNum = reunionesEliminadas.length

    // retrieves semesters
    const semesterRequest = await axiosInstance.get('/semesters')
    const semesterJSON = semesterRequest.data
    semesters = semesterJSON.semestres  

    // retrieves carreras
    const carreraRequest = await axiosInstance.get('/carreras')
    const carreraJSON = carreraRequest.data
    carreras = carreraJSON.carreras

    res.render('reports', {
      path: 'reports',
      user: req.user,
      isDean,
      isProfessor,
      isStudent,
      isAdmin,
      meetings,
      meetingsNum,
      reunionesEliminadasNum,
      gpa,
      conditionedNum,
      semesters,
      carreras,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

// report filters
router.get('/reports-by-semester/:semesterId', async (req, res) => {
  semesterReportsRequest = await axiosInstance.get('/reports-by-semester', {params: {semesterId: req.params.semesterId}})
  semesterReportJSON = semesterReportsRequest.data

  meetings = semesterReportJSON.reuniones
  meetingsNum = meetings.length

  // Fixes meeting date format 
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

  res.send(semesterReportJSON)
})

router.get('/reports-by-carrera/:carreraId', async (req, res) => {
  carreraReportsRequest = await axiosInstance.get('/reports-by-carrera', {params: {carreraId: req.params.carreraId}})
  carreraReportJSON = carreraReportsRequest.data

  meetings = carreraReportJSON.reuniones
  meetingsNum = meetings.length

  // Fixes meeting date format 
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

  res.send(carreraReportJSON)
})

// reports without filters
router.get('/reports-without-filters', async (req, res) => {
  try{
    reportsRequest = await axiosInstance.get('/reports')
    reportsJSON = reportsRequest.data

    meetings = reportsJSON.reuniones
    meetingsNum = meetings.length
  
    // Fixes meeting date format 
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
  
    res.send(reportsJSON)

  } catch (error) {
    console.error(error.message)
  }
});

// notification routes
router.get(
  '/notifications',
  isLoggedIn,
  isUserStudentOrProfessor,
  async (req, res) => {
    let isStudent = false
    let isProfessor = false
    let isDean = false
    let isAdmin = false

    for (rol of req.user.roles) {
      if(rol.rolId === 1) {
        isDean = true
      }

      if(rol.rolId === 2) {
        isProfessor = true
      }

      if(rol.rolId === 3) {
        isStudent = true
      }

      if(rol.rolId === 4) {
        isAdmin = true
      }
    }

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

    res.render('notifications', {
      path: 'notifications',
      user: req.user,
      notifications: notifications,
      isDean,
      isProfessor,
      isStudent,
      isAdmin,
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
  request = ""

  if (meetingOption === "1") {
    request = await axiosInstance.post('/meetings/accept', {meetingId: meetingId, notificationId: notificationId, comment: comment, profesorId: profesorId, email: email})
  } else {
    request = await axiosInstance.post('/meetings/reject', {meetingId: meetingId, notificationId: notificationId, comment: comment, profesorId: profesorId, email: email})
  }

  meetingJSON = request.data
  meeting = meetingJSON.meeting

  console.log("meeting: ", meeting);

  if(meeting.emailNotificacion) {
    professorRequest = await axiosInstance.get('/user-by-id', {params: {userId: req.body.profesorId}})
    professor = professorRequest.data
  
    student = req.user
  
    // change date format 
    const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
    meeting.fecha =
    dateTimeValues[0] +
    ' ' +
    dateTimeValues[1] +
    ':' +
    dateTimeValues[2] +
    dateTimeValues[3].text;
  
    console.log("Meeting: ", meeting);
  
    emailRequest = await axiosInstance.post('/send-meeting-notification', {student: student, professor: professor, meeting: meeting})
    emailJSON = emailRequest.data
  }

  res.redirect('/notifications');
});

router.get('/delete-notification/:notificationId', async (req, res) => {
  try {
    request = await axiosInstance.post('/delete-notification', {notificationId: req.params.notificationId})

    res.redirect('/notifications')
  } catch (error) {
    console.error(error.message);
  }

})

router.get('/archive-notification/:notificationId', async (req, res) => {
  try {
    request = await axiosInstance.post('/archive-notification', {notificationId: req.params.notificationId})

    res.redirect('/notifications')
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/viewed-notification', async (req, res) => {
  await axiosInstance.post('/viewed-notification', {notificationId: req.body.notificationId})

  res.send({status: "ok"})
});

// EDIT PROFILE
router.get('/edit-profile', isLoggedIn, async (req, res) => {
  let isStudent = false
  let isProfessor = false
  let isDean = false
  let isAdmin = false

  for (rol of req.user.roles) {
    if(rol.rolId === 1) {
      isDean = true
    }

    if(rol.rolId === 2) {
      isProfessor = true
    }

    if(rol.rolId === 3) {
      isStudent = true
    }

    if(rol.rolId === 4) {
      isAdmin = true
    }
  }

  const notificationsRequest = await axiosInstance.get('/active-notifications', {
    params: { userId: req.user.id }
  });
  const notificationsJSON = notificationsRequest.data;

  notificationsNum = notificationsJSON.notifications.length;

  res.render('edit-profile', {
    user: req.user,
    isDean,
    isProfessor,
    isStudent,
    isAdmin,
    notificationsNum: notificationsNum,
    showNotifications: global.showNotifications,
    success: req.flash('success'),
    error: req.flash('error')
  })
});

router.post('/edit-profile', isLoggedIn, upload.single("file"), async (req, res) => {
  try {
    file = undefined
    if(req.file){ 
      filePath = global.appRoot + '/public/img/uploads/' + req.file.filename
      file = {
        formato: req.file.mimetype,
        nombre: `${Date.now()}-${req.file.originalname}`,
        datos: fs.readFileSync(filePath).toString("binary"),
        uploadedOn: new Date()
      }

      console.log("Deleting created file from system...");
          
      // removes file after saved into DB 
      fs.unlinkSync(filePath)

      console.log("File has been deleted");
    }

    editProfileRequest = await axiosInstance.post('/edit-profile', {firstNames: req.body.userNames, lastNames: req.body.userLastNames, email: req.body.userEmail, phone: req.body.userPhone, userId: req.user.id, file: file})
    
    req.flash('success', 'Tus datos han sido actualizados exitosamente!');

    res.redirect('/home')
  } catch (error) {
    console.error(error.message);
  }
})

// CHANGE PASSWORD
router.get('/change-password/', isLoggedIn, async (req, res) => {
  let isStudent = false
  let isProfessor = false
  let isDean = false
  let isAdmin = false

  for (rol of req.user.roles) {
    if(rol.rolId === 1) {
      isDean = true
    }

    if(rol.rolId === 2) {
      isProfessor = true
    }

    if(rol.rolId === 3) {
      isStudent = true
    }

    if(rol.rolId === 4) {
      isAdmin = true
    }
  }

  const notificationsRequest = await axiosInstance.get('/active-notifications', {
    params: { userId: req.user.id }
  });
  const notificationsJSON = notificationsRequest.data;

  notificationsNum = notificationsJSON.notifications.length;

  res.render('auth/change-password', {
    headerTitle: '¿Quieres Cambiar tu Contraseña?',
    userId: req.user.id,
    createBtnText: 'Cambiar Contraseña',
    user: req.user,
    isDean,
    isProfessor,
    isStudent,
    isAdmin,
    notificationsNum: notificationsNum,
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
  try {
    file = {
      formato: req.file.mimetype,
      nombre: `${Date.now()}-${req.file.originalname}`,
      datos: fs.readFileSync(global.appRoot + '/public/img/uploads/' + req.file.filename).toString("binary"),
      uploadedOn: new Date()
    }

    uploadRequest = await axiosInstance.post('/upload', {file: file})

    res.redirect('/upload')
    
  } catch (error) {
    console.error(error.message);
  }
})

module.exports = router;
