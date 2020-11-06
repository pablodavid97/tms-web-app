const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const utils = require('./utils');
const axiosInstance = require('../http-client');

/* ----- CONFIGURATION FILE FOR PASSPORT ----------*/

// authentication signin configurations (email, password)
passport.use(
  'local.signin',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    async (req, email, password, done) => {
      try {
        const request = await axiosInstance.get('/user-by-email', {
          params: { email }
        });
        signInJSON = request.data;

        if (signInJSON) {
          user = signInJSON;

          const passwordMatch = await utils.matchPassword(password, user.hash);

          if (passwordMatch) {
            global.showNotifications = true
            return done(
              null,
              user,
              req.flash('success', `Bienvenido/a ${user.nombres}`)
            );
          }
          return done(null, false, req.flash('error', 'Las credenciales ingresadas son incorrectas.'));
        }
        return done(
          null,
          false,
          req.flash('error', 'Las credenciales ingresadas son incorrectas.')
        );
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const request = await axiosInstance.get('/user-by-id', {
    params: { userId: id }
  });
  const userJSON = request.data;

  done(null, userJSON);
});
