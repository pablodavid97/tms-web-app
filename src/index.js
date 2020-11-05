const express = require('express');
const hbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const mysql = require('mysql');

// Dev dependencies
const reload = require('reload');
const morgan = require('morgan');

// const { database } = require('./keys');

// initializations
require('dotenv').config();

const hostname = '127.0.0.1';
const port = 4000;
const app = express();
require('./lib/passport');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const { body } = require('express-validator');
const pool = require('./database');

// settings
app.set('port', process.env.PORT || port);
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  hbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/helpers')
  })
);
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
app.use(
  session({
    genId: (req) => {
      console.log('Inside the session middleware');
      console.log(req.sessionID);
      return uuid();
    },
    secret: 'session_cookie_secret',
    resave: false,
    saveUninitialized: false
    // store: new MySQLStore({}, pool)
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

global.showNotifications = "heelloww";

// routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/meetings', require('./routes/meetings'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// server
if (process.env.NODE_ENV === 'production') {
  app.listen(port, hostname, () => {
    console.log('Running in production');
    console.log(`Server running at http://${hostname}:${port}/`);
  });
} else {
  reload(app)
    .then((reloadReturned) => {
      app.listen(port, hostname, () => {
        console.log('Running in development');
        console.log(`Server running at http://${hostname}:${port}/`);
      });
    })
    .catch((err) => {
      console.error('Reload could not start', err);
    });
}
