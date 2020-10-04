const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const reload = require('reload');

// initializations
require('dotenv').config();
const hostname = '127.0.0.1';
const port = 4000;
const app = express();
require('./lib/passport');


// settings
app.set('port', process.env.PORT || port)
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs({
  defaultLayout: 'main',
  layoutsDir: path.join(app.get('views'), 'layouts'),
  partialsDir: path.join(app.get('views'), 'partials'),
  extname: '.hbs',
  helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());

// global variables
app.use((req, res, next) => {
  next();
});

global.appRoot = path.resolve(__dirname);

// routes
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use(require('./routes/mail-api'));


// public
app.use(express.static(path.join(__dirname, 'public')));

// server
if(process.env.NODE_ENV === 'production') {
  app.listen(port, hostname, () => {
    console.log("Running in production");
    console.log(`Server running at http://${hostname}:${port}/`);
  });
} else {

  reload(app).then((reloadReturned) => {
    app.listen(port, hostname, () => {
      console.log("Running in development");
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }).catch((err) => {
    console.error("Reload could not start", err);
  });
}
