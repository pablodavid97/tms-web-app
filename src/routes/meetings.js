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

    lastId = 0;

    if (lastRowId > 0) {
      lastId = lastRowId + 1;
    }

    const notificationsRequest = await axiosInstance.get('/notifications', {
      params: { rolId: req.user.rolId, userId: req.user.id }
    });
    const notificationsJSON = notificationsRequest.data;

    notifications = notificationsJSON.notifications;

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
      notifications,
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
    isStudent = req.user.rolId === 3;
    isProfessor = req.user.rolId === 2;
    student = undefined;

    meetingRequest = await axiosInstance.get('/meetings/meeting-by-id', {
      params: { meetingId: req.params.meetingId }
    });
    meeting = meetingRequest.data;

    if (isProfessor) {
      studentRequest = await axiosInstance.get('/student', {
        params: { userId: meeting.estudianteId }
      });
      student = studentRequest.data.estudiante;
    }

    res.render('meetings/meeting-in-progress', {
      path: 'meetings',
      user: req.user,
      meeting: meeting,
      notificationId: req.params.notificationId,
      isStudent: isStudent,
      isProfessor: isProfessor,
      student: student,
      success: req.flash('success'),
      error: req.flash('error')
    });
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/create', async (req, res) => {
  dateTime = utils.getDateTimeFormat(
    req.body.date,
    req.body.hours,
    req.body.minutes,
    req.body.format
  );

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

    req.flash('success', 'La reunión fue creada con exito!');
    res.redirect('/meetings');
  } catch (error) {
    console.error(error.message);
  }
  // Create a new meeting
});

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
      date = dateTime[0];
      hours = dateTime[1];
      minutes = dateTime[2];
      format = dateTime[3];

      hourValues = utils.getHourValues();
      minuteValues = utils.getMinuteValues();

      const notificationsRequest = await axiosInstance.get('/notifications', {
        params: { rolId: req.user.rolId, userId: req.user.id }
      });
      const notificationsJSON = notificationsRequest.data;

      notifications = notificationsJSON.notifications;

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
        hourValues,
        minuteValues,
        notifications,
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

    req.flash('success', 'La reunión fue actualizada con exito!');

    res.redirect('/meetings');
  } catch (error) {
    console.error(error.message);
  }
});

router.post('/done', async (req, res) => {
  isStudent = req.user.rolId === 3;
  isProfessor = req.user.rolId === 2;

  try {
    meetingRequest = await axiosInstance.post('/meetings/done', {
      meetingId: req.body.meetingId,
      notificationId: req.body.notificationId,
      meetingOption: req.body.meetingOption,
      comment: req.body.comment,
      isProfessor: isProfessor,
      isStudent: isStudent
    });
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

      const notificationsRequest = await axiosInstance.get('/notifications', {
        params: { rolId: req.user.rolId, userId: req.user.id }
      });
      const notificationsJSON = notificationsRequest.data;

      notifications = notificationsJSON.notifications;

      res.render('meetings/reschedule', {
        path: 'meetings',
        user: req.user,
        meeting,
        date,
        hours,
        minutes,
        format,
        isStudent: false,
        isProfessor: true,
        hourValues,
        minuteValues,
        notifications,
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

    req.flash('success', 'La reunión fue reagendada con exito!');

    res.redirect('/notifications');
  } catch (error) {
    console.error(error.message);
  }
});

router.get('/meeting-details/:meetingId', async (req, res) => {
  try {
    isStudent = req.user.rolId === 3
    isProfessor = req.user.rolId === 2
    isDean = req.user.rolId === 1

    meetingRequest = await axiosInstance.get('/meetings/meeting-by-id', {
      params: { meetingId: req.params.meetingId }
    });
    meeting = meetingRequest.data;

    console.log("meeting: ", meeting);

    const dateTimeValues = utils.getDateTimeValues(meeting.fecha);
    meeting.fecha = dateTimeValues[0] + ' ' + dateTimeValues[1] + ':' + dateTimeValues[2] + dateTimeValues[3].text;

    res.render('meetings/meeting-details', {
      path: 'meetings',
      user: req.user,
      meeting: meeting,
      isStudent: isStudent,
      isProfessor: isProfessor,
      isDean: isDean,
      success: req.flash('success'),
      error: req.flash('error')
    }); 
  } catch (error) {
    console.error(error.message);
  }
})

module.exports = router;
