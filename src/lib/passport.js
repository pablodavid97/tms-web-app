const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../database');
const utils = require('./utils');


/* ----- CONFIGURATION FILE FOR PASSPORT ----------*/

// authentication signin configurations (email, password)
passport.use('local.signin', new LocalStrategy ({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const rows = await pool.query('SELECT * FROM usuario WHERE correo_institucional = ?', [email]);

            if (rows.length > 0) {
                user = rows[0]
    
                const passwordMatch = await utils.matchPassword(password, user.hash) 
                // console.log("Passwords Match?: ", passwordMatch);
    
                if(passwordMatch){
                    return done(null, user, req.flash('success', 'Bienvenido/a ' + user.nombres))
                } else {
                    return done(null, false, req.flash('error', 'Contraseña incorrecta'));
                }
            } else {
                return done(null, false, req.flash('error', 'El usuario ingresado no está registrado'));
            }
        } catch (error) {
            return done(error)
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    done(null, rows[0]);
  });
