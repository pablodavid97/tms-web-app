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
        userPassword = await helpers.encryptPassword(password);

        pool.query('SELECT * FROM usuario WHERE correo_institucional = ?', [email], async (error, results, fields) => {
            if(error) return done(error);
            console.log("Results: ", results);

            const passwordMatch = await helpers.matchPassword(userPassword, results[0].hash) 

            if(passwordMatch){
                return done(null, results[0])
            } else {
                return done(null, false)
            }
        });

    }
));

passport.serializeUser((user, done) => {
    done(null, user.usuario_id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    done(null, rows[0]);
  });
