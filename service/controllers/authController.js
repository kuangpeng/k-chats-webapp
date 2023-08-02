const Users = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appConfig = require('./../app.config');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const debug = require('debug')('app:authController');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.register = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return next(new AppError('请填写用户名或密码', 400));
  }

  const isExitedUser = await Users.find({ name });

  if (isExitedUser && isExitedUser.length > 0) {
    return next(new AppError('请使用其他用户名', 400));
  }

  if (!req.body.avatar) {
    req.body.avatar = appConfig.user.avatar.default;
  }

  const newUser = new Users({
    name,
    password,
    avatar: req.body.avatar
  });

  const user = await newUser.save();

  const token = signToken(user._id);

  res.json({
    status: 'success',
    token,
    data: user
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return next(new AppError('请填写用户名或密码'), 400);
  }

  const user = await Users.findOne({ name }).select('+password');

  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new AppError('用户名或密码错误', 401));
  }

  const token = signToken(user._id);

  res.json({
    status: 'success',
    token,
    data: user
  });
});

exports.logout = catchAsync((req, res, next) => {});

exports.checkAuth = catchAsync(async (req, res, next) => {
  const token = req.get('token');

  if (!token) {
    return next(new AppError('请登录', 401));
  }

  const decode = jwt.verify(token, process.env.JWT_SECRET);

  const user = await Users.findById(decode.id);

  if (!user) {
    return next(new AppError('请重新登陆', 401));
  }

  req.user = user;

  next();
});
