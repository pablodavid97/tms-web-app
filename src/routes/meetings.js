const express = require('express');
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
      params: { userRoles: req.user.roles, userId: req.user.id }
    });
    const meetingsJSON = request.data;

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

    studentInfo = meetingsJSON.studentInfo;
    tutor = meetingsJSON.tutor;
    students = meetingsJSON.students;
    meetings = meetingsJSON.meetings;
    lastRowId = meetingsJSON.lastRowId;
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

    hourValues = utils.getHourValues();
    minuteValues = utils.getMinuteValues();

    lastId = lastRowId + 1;

    const notificationsRequest = await axiosInstance.get(
      '/active-notifications',
      {
        params: { userId: req.user.id }
      }
    );
    const notificationsJSON = notificationsRequest.data;

    notificationsNum = notificationsJSON.notifications.length;

    res.render('meetings/list', {
      path: 'meetings',
      user: req.user,
      meetings,
      isStudent,
      tutor,
      studentInfo,
      isDean,
      isProfessor,
      isStudent,
      isAdmin,
      students,
      hourValues,
      minuteValues,
      lastId,
      notificationsNum,
      showNotifications: global.showNotifications,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/go-to-meeting/:meetingId/:notificationId', async (req, res) => {
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

    student = undefined;
    gpa = 0;

    meetingRequest = await axiosInstance.get('/meetings/meeting-by-id', {
      params: { meetingId: req.params.meetingId }
    });
    meeting = meetingRequest.data;

    if (isProfessor) {
      studentRequest = await axiosInstance.get('/student', {
        params: { userId: meeting.estudianteId }
      });
      student = studentRequest.data.estudiante;
      gpa = studentRequest.data.gpa;
    }

    res.render('meetings/meeting-in-progress', {
      path: 'meetings',
      user: req.user,
      meeting: meeting,
      notificationId: req.params.notificationId,
      isStudent,
      isProfessor,
      isDean,
      isAdmin,
      student: student,
      gpa,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

// changes meeting state to 1
router.post('/create', async (req, res) => {
  dateTime = utils.getDateTimeFormat(
    req.body.date,
    req.body.hours,
    req.body.minutes,
    req.body.format
  );

  emailNotification = false;
  if (req.body.emailNotification) {
    emailNotification = true;
  }

  try {
    request = await axiosInstance.post('/meetings/create', {
      subject: req.body.subject,
      description: req.body.description,
      date: dateTime,
      professorId: req.user.id,
      studentId: req.body.student,
      semesterId: global.currentSemester,
      email: req.user.correoInstitucional,
      emailNotification: emailNotification
    });
    meetingJSON = request.data;

    if (emailNotification) {
      studentRequest = await axiosInstance.get('/user-by-id', {
        params: { userId: req.body.student }
      });
      student = studentRequest.data;

      professor = req.user;
      meeting = meetingJSON.meeting;

      // change date format
      const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
      meeting.fecha =
        dateTimeValues[0] +
        ' ' +
        dateTimeValues[1] +
        ':' +
        dateTimeValues[2] +
        dateTimeValues[3].text;

      emailRequest = await axiosInstance.post('/send-meeting-notification', {
        student: student,
        professor: professor,
        meeting: meeting
      });
      emailJSON = emailRequest.data;
    }

    req.flash('success', 'La reunión fue creada con exito!');
    res.redirect('/meetings');
  } catch (error) {
    console.error(error.message);
  }
  // Create a new meeting
});

// changes meeting state to 5
router.get(
  '/delete/:meetingId/:studentId',
  isLoggedIn,
  isProfessorUser,
  async (req, res) => {
    try {
      request = await axiosInstance.post('/meetings/delete', {
        meetingId: req.params.meetingId,
        studentId: req.params.studentId,
        email: req.user.correoInstitucional
      });
      deleteJSON = request.data;
      meeting = deleteJSON.meeting;

      if (meeting.emailNotificacion) {
        studentRequest = await axiosInstance.get('/user-by-id', {
          params: { userId: req.params.studentId }
        });
        student = studentRequest.data;

        professor = req.user;

        // change date format
        const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
        meeting.fecha =
          dateTimeValues[0] +
          ' ' +
          dateTimeValues[1] +
          ':' +
          dateTimeValues[2] +
          dateTimeValues[3].text;

        emailRequest = await axiosInstance.post('/send-meeting-notification', {
          student: student,
          professor: professor,
          meeting: meeting
        });
        emailJSON = emailRequest.data;
      }

      req.flash('success', 'La reunión fue eliminada con exito');

      res.redirect('/meetings');
    } catch (error) {
      console.error(error.message);
    }
  }
);

// changes meeting state to 2
router.get(
  '/edit/:meetingId',
  isLoggedIn,
  isProfessorUser,
  async (req, res) => {
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

      request = await axiosInstance.get('/meetings/meeting-by-id', {
        params: { meetingId: req.params.meetingId }
      });
      editMeetingJSON = request.data;

      meeting = editMeetingJSON;

      dateTime = utils.getDateTimeValues(meeting.fecha);
      date = dateTime[0];
      hours = dateTime[1];
      minutes = dateTime[2];
      format = dateTime[3];

      hourValues = utils.getHourValues();
      minuteValues = utils.getMinuteValues();

      const notificationsRequest = await axiosInstance.get(
        '/active-notifications',
        {
          params: { userId: req.user.id }
        }
      );
      const notificationsJSON = notificationsRequest.data;

      notificationsNum = notificationsJSON.notifications.length;

      res.render('meetings/edit', {
        path: 'meetings',
        user: req.user,
        meeting,
        date,
        hours,
        minutes,
        format,
        isStudent,
        isProfessor,
        isDean,
        isAdmin,
        hourValues,
        minuteValues,
        notificationsNum,
        showNotifications: global.showNotifications,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.post('/edit', async (req, res) => {
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
      studentId: req.body.studentId,
      email: req.user.correoInstitucional,
      meetingId: req.body.meetingId
    });
    editMeetingJSON = request.data;
    meeting = editMeetingJSON.meeting;

    if (meeting.emailNotificacion) {
      studentRequest = await axiosInstance.get('/user-by-id', {
        params: { userId: req.body.studentId }
      });
      student = studentRequest.data;

      professor = req.user;

      // change date format
      const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
      meeting.fecha =
        dateTimeValues[0] +
        ' ' +
        dateTimeValues[1] +
        ':' +
        dateTimeValues[2] +
        dateTimeValues[3].text;

      emailRequest = await axiosInstance.post('/send-meeting-notification', {
        student: student,
        professor: professor,
        meeting: meeting
      });
      emailJSON = emailRequest.data;
    }

    req.flash('success', 'La reunión fue actualizada con exito!');

    res.redirect('/meetings');
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/done', async (req, res) => {
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

  try {
    meetingRequest = await axiosInstance.post('/meetings/done', {
      meetingId: req.body.meetingId,
      notificationId: req.body.notificationId,
      meetingOption: req.body.meetingOption,
      comment: req.body.comment,
      isProfessor: isProfessor,
      isStudent: isStudent
    });
    meetingJSON = meetingRequest.data;

    meeting = meetingJSON.meeting;

    if (meeting.emailNotificacion) {
      studentRequest = await axiosInstance.get('/user-by-id', {
        params: { userId: meeting.estudianteId }
      });
      student = studentRequest.data;

      professor = req.user;

      // change date format
      const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
      meeting.fecha =
        dateTimeValues[0] +
        ' ' +
        dateTimeValues[1] +
        ':' +
        dateTimeValues[2] +
        dateTimeValues[3].text;

      if (req.body.meetingOption === '1') {
        meeting.estadoId = 7;
      } else {
        meeting.estadoId = 8;
      }

      emailRequest1 = await axiosInstance.post('/send-meeting-notification', {
        student: student,
        professor: professor,
        meeting: meeting,
        isProfessor: true
      });
      emailJSON1 = emailRequest1.data;

      emailRequest2 = await axiosInstance.post('/send-meeting-notification', {
        student: student,
        professor: professor,
        meeting: meeting,
        isStudent: true
      });
      emailJSON2 = emailRequest2.data;
    }

    req.flash('success', 'La reunión fue actualizada con exito!');

    res.redirect('/notifications');
  } catch (error) {
    console.error(error.message);
  }
});

router.get(
  '/reschedule/:meetingId/:notificationId',
  isLoggedIn,
  isProfessorUser,
  async (req, res) => {
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

      meetingRequest = await axiosInstance.get('/meetings/meeting-by-id', {
        params: { meetingId: req.params.meetingId }
      });
      rescheduleMeetingJSON = meetingRequest.data;

      meeting = rescheduleMeetingJSON;

      dateTime = utils.getDateTimeValues(meeting.fecha);
      date = dateTime[0];
      hours = dateTime[1];
      minutes = dateTime[2];
      format = dateTime[3];

      hourValues = utils.getHourValues();
      minuteValues = utils.getMinuteValues();

      const notificationsRequest = await axiosInstance.get(
        '/active-notifications',
        {
          params: { userId: req.user.id }
        }
      );
      const notificationsJSON = notificationsRequest.data;

      notificationsNum = notificationsJSON.notifications.length;

      res.render('meetings/reschedule', {
        path: 'meetings',
        user: req.user,
        meeting,
        date,
        hours,
        minutes,
        format,
        isStudent,
        isProfessor,
        isDean,
        isAdmin,
        hourValues,
        minuteValues,
        notificationsNum,
        showNotifications: global.showNotifications,
        notificationId: req.params.notificationId,
        success: req.flash('success'),
        error: req.flash('error')
      });
    } catch (error) {
      console.error(error.message);
    }
  }
);

router.post('/reschedule', async (req, res) => {
  try {
    dateTime = utils.getDateTimeFormat(
      req.body.date,
      req.body.hours,
      req.body.minutes,
      req.body.format
    );

    request = await axiosInstance.post('/meetings/reschedule', {
      subject: req.body.subject,
      description: req.body.description,
      date: dateTime,
      studentId: req.body.studentId,
      email: req.user.correoInstitucional,
      meetingId: req.body.meetingId,
      notificationId: req.body.notificationId
    });
    rescheduleMeetingJSON = request.data;
    meeting = rescheduleMeetingJSON.meeting;

    // sends email notification
    if (meeting.emailNotificacion) {
      studentRequest = await axiosInstance.get('/user-by-id', {
        params: { userId: req.body.studentId }
      });
      student = studentRequest.data;

      professor = req.user;

      // change date format
      const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
      meeting.fecha =
        dateTimeValues[0] +
        ' ' +
        dateTimeValues[1] +
        ':' +
        dateTimeValues[2] +
        dateTimeValues[3].text;

      emailRequest = await axiosInstance.post('/send-meeting-notification', {
        student: student,
        professor: professor,
        meeting: meeting
      });
      emailJSON = emailRequest.data;
    }

    req.flash('success', 'La reunión fue reagendada con exito!');

    res.redirect('/notifications');
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/meeting-details/:meetingId', async (req, res) => {
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

    meetingRequest = await axiosInstance.get('/meetings/meeting-by-id', {
      params: { meetingId: req.params.meetingId }
    });
    meeting = meetingRequest.data;

    const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
    meeting.fecha =
      dateTimeValues[0] +
      ' ' +
      dateTimeValues[1] +
      ':' +
      dateTimeValues[2] +
      dateTimeValues[3].text;

    const notificationsRequest = await axiosInstance.get(
      '/active-notifications',
      {
        params: { userId: req.user.id }
      }
    );
    const notificationsJSON = notificationsRequest.data;

    notificationsNum = notificationsJSON.notifications.length;

    res.render('meetings/meeting-details', {
      path: 'meetings',
      user: req.user,
      meeting: meeting,
      isStudent,
      isProfessor,
      isDean,
      isAdmin,
      notificationsNum,
      showNotifications: global.showNotifications,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

module.exports = router;
