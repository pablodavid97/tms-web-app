const express = require('express');
const router = express.Router();
const passport = require('passport');
const utils = require('../lib/utils');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
const axiosInstance = require('../http-client');

const sendPasswordReset = async (user) => {

  try {
    const res = await axiosInstance.post('/sendmail', user);
    console.log(`Status:  ${res.status}`);
    console.log('Body: ', res.data);
  } catch (err) {
    console.error(err);
  }
};

// SIGN IN
router.get('/signin', isNotLoggedIn, (req, res, next) => {
  res.render('auth/signin', {
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.post('/signin', async (req, res, next) => {
  await passport.authenticate('local.signin', {
    successRedirect: '/home',
    failureRedirect: '/signin',
    failureFlash: true
  })(req, res, next);
});

// RESET PASSWORD
router.get('/forgot-password', isNotLoggedIn, (req, res) => {
  res.render('auth/reset-password', {
    headerTitle: '¿Olvidaste Tu Contraseña?'
  });
});

router.get('/first-time-login', isNotLoggedIn, (req, res) => {
  res.render('auth/reset-password', {
    headerTitle: '¿Primera Vez Que Ingresas?'
  });
});

router.post('/reset-password', async (req, res) => {
  try {
    const request = await axiosInstance.get('user-by-email', {
      params: { email: req.body.email }
    });
    const resetpwdJSON = request.data;

    sendPasswordReset(resetpwdJSON);

    req.flash('success', 'Se envió la información a tu correo');

    res.redirect('/signin');
  } catch (error) {
    console.error(error.message);
  }
});

// CREATE PASSWORD
router.get('/create-password/:userId', isNotLoggedIn, (req, res) => {
  res.render('auth/create-password', {
    headerTitle: 'Restablecer Contraseña',
    userId: req.params.userId,
    success: req.flash('success'),
    error: req.flash('error')
  });
});

router.post('/create-password', async (req, res) => {
  try {
    userId = req.body.userId;
    newPassword = req.body.newPassword;
    confirmation = req.body.confirmation;

    if (newPassword == confirmation) {
      userPassword = await utils.encryptPassword(req.body.newPassword);

      request = await axiosInstance.post('/create-password', {
        hash: userPassword,
        userId: req.body.userId
      });
      createpwdJSON = request.data;

      usuario = createpwdJSON;

      req.flash(
        'success',
        'Bienvenido/a ' +
          usuario.nombres +
          '. La contraseña fue creada con exito.'
      );

      res.redirect('/home');
    } else {
      req.flash('error', 'Las contraseñas no coinciden');
      res.redirect('/create-password/' + userId);
    }
  } catch (error) {
    console.error(error.message);
  }
});

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
    showNotifications: global.showNotifications,
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

router.get('/logout', isLoggedIn, (req, res) => {
  req.logOut();
  res.redirect('/signin');
});

module.exports = router;
