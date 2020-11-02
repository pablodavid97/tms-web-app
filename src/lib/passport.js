const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const utils = require('./utils');
const axios = require('axios');

// Axios instance configurations
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:3000',
  });


/* ----- CONFIGURATION FILE FOR PASSPORT ----------*/

// authentication signin configurations (email, password)
passport.use('local.signin', new LocalStrategy ({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async (req, email, password, done) => {
        try {
            const request = await axiosInstance.get('/user-by-email', {params: {email: email}})
            signInJSON = request.data

            if (signInJSON) {
                user = signInJSON
    
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
    const request = await axiosInstance.get('/user-by-id', {params: {userId: id}})
    const userJSON = request.data

    console.log("user: ", userJSON);

    done(null, userJSON);
  });
