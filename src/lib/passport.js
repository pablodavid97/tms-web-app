const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const helpers = require('./helpers');

/* ----- CONFIGURATION FILE FOR PASSPORT ----------*/

// authentication signin configurations (email, password)
passport.use('local.signin', new LocalStrategy ({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        // console.log(req.body);
        // console.log(email),
        // console.log(password)
        pool.query('SELECT * FROM usuario WHERE correo_institucional = ?', [email], (error, results, fields) => {
            if(error) throw error;
            console.log("Results: ", results);
        });

    }
));

