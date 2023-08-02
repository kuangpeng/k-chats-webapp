const mongoose = require('mongoose');
const bycrypt = require('bcryptjs');
const appConfig = require('./../app.config');

const usersScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '请填写用户名'],
      unique: true
    },
    password: {
      type: String,
      select: false,
      required: [true, '请填写密码'],
      minlength: 6
    },
    avatar: {
      type: String,
      required: [true, '请上传头像']
    },
    gender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: '请填写性别'
      },
      default: 'male'
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'consumer'],
        message: '请填写正确的角色名'
      },
      default: 'consumer'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    collection: 'Users'
  }
);

usersScheme.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bycrypt.hash(this.password, 8);

  next();
});

usersScheme.post('findOne', function (result) {
  if (result) {
    result.avatar = appConfig.locUri + result.avatar;
  }
});

usersScheme.post('find', function (results) {
  results = results.map((r) => {
    r.avatar = appConfig.locUri + r.avatar;
    return r;
  });
});

usersScheme.methods.checkPassword = async function (
  checkPassword,
  userPassword
) {
  return await bycrypt.compare(checkPassword, userPassword);
};

const Users = mongoose.model('Users', usersScheme);

module.exports = Users;
