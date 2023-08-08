const debug = require('debug')('app:chat');
const Chats = require('./../models/chatModel');
const catchAsyncSocket = require('./../utils/catchAsyncSocket');
const AppError = require('./../utils/appError');
const sessionStore = require('./../utils/sessionStore')();
const HANDLERTYPE = require('./handlerType');

module.exports = (io, socket) => {
  const createChat = catchAsyncSocket(async (payload, callback) => {
    const user = socket.request.user;

    const { receiver, body, chatType, groupId, sendAt } = payload;

    if (
      !chatType ||
      !body ||
      (chatType == 'person' && !receiver) ||
      (chatType == 'group' && !groupId)
    ) {
      return callback(new AppError('缺少数据', 400));
    }

    let data = {
      body,
      sender: user._id,
      chatType,
      sendAt
    };

    let targetId = '';
    if (chatType == 'person') {
      data['receiver'] = targetId = receiver;
    } else {
      data['groupId'] = targetId = groupId;
    }

    const chat = new Chats(data);

    const newChat = await chat
      .save()
      .then((chat) =>
        Chats.populate(chat, [
          { path: 'senderInfo', select: '_id name avatar' },
          { path: 'receiverInfo', select: '_id name avatar' },
          { path: 'groupInfo' }
        ])
      );

    const receiverSession = sessionStore.findSession(targetId);

    if (chatType === 'person') {
      socket.to(receiverSession.socketId).emit('receive', newChat);
    } else if (chatType === 'group') {
      // TODO: room message
      socket.to('group:' + targetId).emit('receive', newChat);
    }

    callback(null, newChat);
  });

  socket.on(HANDLERTYPE.CHAT.TALK, createChat);
};
