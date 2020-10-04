const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');
const axios = require('axios');

const sendPasswordReset = async (user) => {
    console.log("Usuario: ", user.nombres);
    const context = {
        user: user
    };
    
    const message = {
        from: process.env.MAIL_SENDER,
        to: process.env.MAIL_RECIPIENT,
        subject: "USFQ Tutorías: Restablece tu contraseña",
        template: "./mailer/password-reset-email",
        context: context
    };

    try {
        const res = await axios.post('http://127.0.0.1:4000/sendmail', message);
        console.log('Status:  ${res.status}');
        console.log('Body: ', res.data);
    } catch (err) {
        console.error(err);
    }
}

// SIGN IN
router.get('/signin', (req, res) => {
    res.render('auth/signin', {website: true})
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next)
});

// RESET PASSWORD 
router.get('/forgot-password', (req, res) => {
    res.render('auth/reset-password', {website: true, headerTitle: "¿Olvidaste Tu Contraseña?"})
});

router.get('/first-time-login', (req, res) => {
    res.render('auth/reset-password', {website: true, headerTitle: "¿Primera Vez Que Ingresas?"})
});

router.post('/reset-password', (req, res) => {
    console.log("Reset PWD Body: ", req.body);

    pool.query('SELECT * FROM usuario WHERE correo_institucional = ?', req.body.email, (error, results, fields) => {
        if(error) throw error;
        
        sendPasswordReset(results[0]);

        console.log("Results: ", results);
    });
    res.redirect('/')
}); 

// CREATE PASSWORD
router.get('/create-password', (req, res) => {
    res.render('auth/create-password', {website: true, headerTitle: "Restablecer Contraseña", isUserActive: false, createBtnText: "Crear Contraseña"})
});

// CHANGE PASSWORD
router.get('/change-password', (req, res) => {
    res.render('auth/create-password', {website: true, headerTitle: "¿Quieres Cambiar tu Contraseña?", isUserActive: true, createBtnText: "Cambiar Contraseña"})
});
module.exports = router;