var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
//db model definition
require('./app_api/models/db');

var indexRouter = require('./app_api/routes/index');
var usersRouter = require('./app_api/routes/users');
const walletsRouter = require('./app_api/routes/wallets');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// allow CORS
// app.use('/api', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization');
//     next();
//   });

app.use('/', indexRouter);
app.use('/api', walletsRouter);
// app.use('/users', usersRouter);

module.exports = app;
