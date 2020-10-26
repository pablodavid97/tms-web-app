const express = require('express');
const router = express.Router();
const pool = require('../database');
const axios = require('axios');
const passport = require('passport');
const utils = require('../lib/utils');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

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
router.get('/signin', isNotLoggedIn, (req, res, next) => {
    res.render('auth/signin', {website: true, success: req.flash('success'), error: req.flash('error')});
});

router.post('/signin', (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/home',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next)
});

// RESET PASSWORD 
router.get('/forgot-password', isNotLoggedIn, (req, res) => {
    res.render('auth/reset-password', {website: true, headerTitle: "¿Olvidaste Tu Contraseña?"})
});

router.get('/first-time-login', isNotLoggedIn, (req, res) => {
    res.render('auth/reset-password', {website: true, headerTitle: "¿Primera Vez Que Ingresas?"})
});

router.post('/reset-password',  async (req, res) => {
    console.log("Reset PWD Body: ", req.body);

    try {
        const rows = await pool.query('SELECT * FROM usuario WHERE correo_institucional = ?', req.body.email)

        sendPasswordReset(rows[0]);
    
        console.log("Results: ", rows);
    
        req.flash('success', 'Se envió la información a tu correo');
    
        res.redirect('/signin');
    } catch (error) {
        throw error;
    }
}); 

// CREATE PASSWORD
router.get('/create-password/:userId', isNotLoggedIn, (req, res) => {
    console.log("Params: ", req.params);
    res.render('auth/create-password', {website: true, headerTitle: "Restablecer Contraseña", isUserActive: false, createBtnText: "Crear Contraseña", userId: req.params.userId, success: req.flash('success'), error: req.flash('error')})
});

router.post('/create-password', async (req, res) => {
    try {
        userId = req.body.userId;
        newPassword = req.body.newPassword;
        confirmation = req.body.confirmation;

        if (newPassword == confirmation) {
            userPassword = await utils.encryptPassword(req.body.newPassword);
            
            await pool.query("UPDATE usuario SET hash = ?, first_time_login = ? WHERE id = ?", [userPassword, false, req.body.userId]);

            const rows = await pool.query("SELECT * from usuario WHERE id = ?", [userId]);
            
            usuario = rows[0];

            req.flash('success', 'Bienvenido/a ' + usuario.nombres + '. La contraseña fue creada con exito.');

            res.redirect('/home');
        } else {
            req.flash('error', 'Las contraseñas no coinciden');
            res.redirect('/create-password/' + userId);
        }
    } catch (error) {
        throw error
    }
})

// CHANGE PASSWORD
router.get('/change-password', isLoggedIn, (req, res) => {
    res.render('auth/create-password', {website: true, headerTitle: "¿Quieres Cambiar tu Contraseña?", isUserActive: true, createBtnText: "Cambiar Contraseña"})
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;