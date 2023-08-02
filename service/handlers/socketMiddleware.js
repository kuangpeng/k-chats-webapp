const jwt = require('jsonwebtoken');
const debug = require('debug')('app:socketMiddleware');
const User = require('./../models/userModel');
const AppError = require('./../utils/appError');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const wrapMiddleware = require('./../utils/wrapMiddleware');
const sessionStore = require('./../utils/sessionStore')();

exports.auth = async (socket, next) => {
  const token = socket.handshake.auth.token || '';

  if (!token) {
    return next(new AppError('请登录', 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decode.id);

  if (!user) {
    return next(new AppError('请重新登陆', 401));
  }

  debug('connected user info:', user.name, socket.id);

  socket.request.user = user;

  // if (!socket.request.session.user) {
  //   socket.request.session.user = {
  //     socketId: socket.id,
  //     _id: user._id,
  //     name: user.name,
  //     connected: socket.connected
  //   };
  // }

  let id = user.get('_id', String);
  sessionStore.saveSession(id, {
    socketId: socket.id,
    userId: id,
    userName: user.name,
    connected: socket.connected
  });

  next();
};

exports.session = wrapMiddleware(
  session({
    secret: 'chat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      // dbName: "example-db-mongoose",
      stringify: false,
      autoRemove: 'interval',
      autoRemoveInterval: 1
    })
  })
);
