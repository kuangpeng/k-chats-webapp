const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
// const bodyParser = require('body-parser')
require('./app.env');
const AppError = require('./utils/appError');
const db = require('./db');
db.start();

const upload = require('./multerM');

const indexRouter = require('./routes/index');

// for test
const contactRouter = require('./routes/contact');
const userRouter = require('./routes/user');
const chatRouter = require('./routes/chat');
const groupRouter = require('./routes/group');
const fileRouter = require('./routes/file');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
// app.use(upload.any());

app.all('*', (req, res, next) => {
  // res.header('Access-Control-Allow-Origin', '*');
  // res.header('Aceess-Control-Allow-Headers', 'content-type');
  // res.header('Aceess-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS');

  if (req.method.toLocaleLowerCase() == 'options') {
    res.send(200);
  } else {
    next();
  }
});

app.use('/api/v1', indexRouter);
app.use('/api/v1/contact', contactRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/chat', chatRouter);
app.use('/api/v1/group', groupRouter);
app.use('/api/v1/file', fileRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`cannot find ${req.originalUrl} on the server!`, 404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  console.log(err.name);

  if (err.name == 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: '请重新登陆'
    });
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  });
});

module.exports = app;
