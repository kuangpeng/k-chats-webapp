const Users = require('../models/userModel');
const Contacts = require('./../models/contactModel');
const catchAsync = require('../utils/catchAsync');
const appConfig = require('../app.config');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const APITool = require('../utils/apiTool');
const debug = require('debug')('app:authController');

exports.getMyContacts = catchAsync(async (req, res, next) => {
  req.query.owner = req.user._id;

  const fetch = new APITool(Contacts.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const contacts = await fetch.query;

  res.json({
    status: 'success',
    data: contacts
  });
});

exports.getContactsById = catchAsync(async (req, res, next) => {
  const cid = req.params.id;

  const contact = await Contacts.findById(cid);

  res.json({
    status: 'success',
    data: contact
  });
});

// 用户添加联系人
exports.createContacts = catchAsync(async (req, res, next) => {
  const owner = req.user._id;
  const { contact } = req.body;

  if (!contact) {
    return next(new AppError('联系人不能为空', 400));
  }

  const contactData = await Contacts.findOne({
    owner,
    contact
  });

  if (contactData) {
    return next(new AppError('不能重复添加此联系人', 400));
  }

  const cuser = await Users.findById(contact);

  if (!cuser) {
    return next(new AppError('该用户不存在', 404));
  }

  const newContacts = [
    {
      owner,
      contact,
      remark: cuser.name
    },
    {
      owner: contact,
      contact: owner,
      remark: req.user.name
    }
  ];

  await Contacts.insertMany(newContacts);

  res.json({
    status: 'success'
  });
});

exports.getStrangers = catchAsync(async (req, res, next) => {
  const user = req.user;

  const myContacts = await Contacts.find({
    owner: user._id
  });

  let ids = [user._id];

  myContacts.forEach((item) => {
    ids.push(item.contact);
  });

  req.query._id = {
    $nin: ids
  };

  next();
});

exports.updateContact = catchAsync(async (req, res, next) => {
  const user = req.user;
  const { remark } = req.body;
  const contactId = req.params.id;

  if (!remark) return next(new AppError('缺少更新数据', 403));

  await Contacts.findOneAndUpdate(
    {
      owner: user._id,
      contact: contactId
    },
    {
      remark
    }
  );

  res.json({
    status: 'success'
  });
});
