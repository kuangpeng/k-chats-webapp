const debug = require('debug')('app:contacts');
const catchAsyncSocket = require('./../utils/catchAsyncSocket');
const AppError = require('./../utils/appError');
const Users = require('./../models/userModel');
const Contacts = require('./../models/contactModel');
const sessionStore = require('./../utils/sessionStore')();
const HANDLERTYPE = require('./handlerType');

module.exports = (io, socket) => {
  // TODO: to test
  const addContact = catchAsyncSocket(async (payload, callback) => {
    const owner = socket.request.user._id;
    const contact = payload.contact;

    if (!contact) {
      return callback(new AppError('联系人不能为空', 400));
    }

    const contactData = await Contacts.findOne({
      owner,
      contact
    });

    if (contactData) {
      return callback(new AppError('不能重复添加此联系人', 400));
    }

    const cuser = await Users.findById(contact);

    if (!cuser) {
      return callback(new AppError('该用户不存在', 404));
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
        remark: socket.request.user.name
      }
    ];

    await Contacts.insertMany(newContacts);

    const newContactOt = await Contacts.findOne({ owner, contact });
    const newContactMe = await Contacts.findOne({
      owner: contact,
      contact: owner
    });

    const receiverSession = sessionStore.findSession(contact);

    receiverSession &&
      socket
        .to(receiverSession.socketId)
        .emit(HANDLERTYPE.CONTACT.ON_NEW, newContactMe);

    callback(null, newContactOt);
  });

  socket.on(HANDLERTYPE.CONTACT.ADD, addContact);
};
