const express = require('express');
const morgan = require('morgan');
const hbs = require('express-handlebars');
const path = require('path');

// initializations
require('dotenv').config();
const hostname = '127.0.0.1';
const port = 4000;
const app = express();


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

// global variables
app.use((req, res, next) => {
  next();
});

// routes
app.use(require('./routes/index.js'));
app.use('/links', require('./routes/links.js'));

// public
app.use(express.static(path.join(__dirname, 'public')));

// server
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
