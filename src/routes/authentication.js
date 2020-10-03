const express = require('express');
const router = express.Router();
const pool = require('../database');
const passport = require('passport');

// SIGN IN
router.get('/signin', (req, res) => {
    res.render('auth/signin')
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
    res.render('auth/reset-password', {headerTitle: "¿Olvidaste Tu Contraseña?"})
});

router.get('/first-time-login', (req, res) => {
    res.render('auth/reset-password', {headerTitle: "¿Primera Vez Que Ingresas?"})
});

// CREATE PASSWORD
router.get('/create-password', (req, res) => {
    res.render('auth/create-password')
});


router.get('/change-password')

module.exports = router;