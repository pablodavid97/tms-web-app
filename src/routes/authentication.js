const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const passport = require('passport');
const utils = require('../lib/utils');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

// Axios instance configurations
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
  });

const sendPasswordReset = async (user) => {
    console.log("Usuario: ", user.nombres);
    
    try {
        const res = await axiosInstance.post('/sendmail', user);
        console.log(`Status:  ${res.status}`);
        console.log('Body: ', res.data);
    } catch (err) {
        console.error(err);
    }
}

// SIGN IN
router.get('/signin', isNotLoggedIn, (req, res, next) => {
    console.log('Inside GET /login callback function')
    console.log(req.sessionID)
    res.render('auth/signin', {success: req.flash('success'), error: req.flash('error')});
});

router.post('/signin', async (req, res, next) => {
    console.log('Inside POST /login callback function')
    console.log(req.body)

    await passport.authenticate('local.signin', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next)
});

// RESET PASSWORD 
router.get('/forgot-password', isNotLoggedIn, (req, res) => {
    res.render('auth/reset-password', {headerTitle: "¿Olvidaste Tu Contraseña?"})
});

router.get('/first-time-login', isNotLoggedIn, (req, res) => {
    res.render('auth/reset-password', {headerTitle: "¿Primera Vez Que Ingresas?"})
});

router.post('/reset-password',  async (req, res) => {
    console.log("Reset PWD Body: ", req.body);

    try {
        const request = await axiosInstance.post('reset-password', {email: req.body.email})
        const resetpwdJSON = request.data

        console.log("Request: ", resetpwdJSON);

        sendPasswordReset(resetpwdJSON);
    
        req.flash('success', 'Se envió la información a tu correo');
    
        res.redirect('/signin');
    } catch (error) {
        console.error(error.message);
    }
}); 

// CREATE PASSWORD
router.get('/create-password/:userId', isNotLoggedIn, (req, res) => {
    console.log("Params: ", req.params);
    res.render('auth/create-password', {headerTitle: "Restablecer Contraseña", isUserActive: false, createBtnText: "Crear Contraseña", userId: req.params.userId, success: req.flash('success'), error: req.flash('error')})
});

router.post('/create-password', async (req, res) => {
    try {
        userId = req.body.userId;
        newPassword = req.body.newPassword;
        confirmation = req.body.confirmation;

        if (newPassword == confirmation) {
            userPassword = await utils.encryptPassword(req.body.newPassword);

            request = await axiosInstance.post('/create-password', {hash: userPassword, userId: req.body.userId})
            createpwdJSON = request.data
            
            usuario = createpwdJSON;

            req.flash('success', 'Bienvenido/a ' + usuario.nombres + '. La contraseña fue creada con exito.');

            res.redirect('/home');
        } else {
            req.flash('error', 'Las contraseñas no coinciden');
            res.redirect('/create-password/' + userId);
        }
    } catch (error) {
        console.error(error.message);
    }
})

// CHANGE PASSWORD
router.get('/change-password', isLoggedIn, (req, res) => {
    res.render('auth/create-password', {headerTitle: "¿Quieres Cambiar tu Contraseña?", isUserActive: true, createBtnText: "Cambiar Contraseña"})
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;