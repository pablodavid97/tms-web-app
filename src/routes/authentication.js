const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const passport = require('passport');
const helpers = require('./../lib/helpers');

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
router.get('/create-password/:userId', (req, res) => {
    console.log("Params: ", req.params);
    res.render('auth/create-password', {website: true, headerTitle: "Restablecer Contraseña", isUserActive: false, createBtnText: "Crear Contraseña", userId: req.params.userId})
});

router.post('/create-password', async (req, res) => {
    console.log("Request body: ", req.body);
    try {
        userPassword = await helpers.encryptPassword(req.body.newPassword);

        pool.query("UPDATE usuario SET hash = ? WHERE usuario_id = ?", [userPassword, req.body.userId], (error, results, fields) => {
            if(error) throw error;
    
            console.log("Resutls: ", results);
            res.redirect('/')
        });
    } catch (error) {
        throw error
    }
})

// CHANGE PASSWORD
router.get('/change-password', (req, res) => {
    res.render('auth/create-password', {website: true, headerTitle: "¿Quieres Cambiar tu Contraseña?", isUserActive: true, createBtnText: "Cambiar Contraseña"})
});
module.exports = router;