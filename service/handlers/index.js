const middleware = require('./socketMiddleware');
const registerChatHandler = require('./chatHandler');
const registerContactsHandler = require('./contactsHandler');
const registerGroupHandler = require('./groupHandler');

module.exports = (io) => {
  // io.use(middleware.session);

  io.use(middleware.auth);

  io.on('connection', (socket) => {
    // 上线通知- 通知其他用户
    // socket.broadcast.emit('user:online', {
    //   userId: socket.user._id,
    //   name: socket.user.name
    // });

    //
    registerChatHandler(io, socket);
    registerContactsHandler(io, socket);
    registerGroupHandler(io, socket);
  });
};
