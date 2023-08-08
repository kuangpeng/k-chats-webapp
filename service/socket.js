const { Server } = require('socket.io');
const { instrument } = require('@socket.io/admin-ui');
const debug = require('debug')('app:socket');
const handlers = require('./handlers');

module.exports = (httpServer) => {
  // init io instance
  const io = new Server(httpServer, {
    cors: {
      // origin: ['https://admin.socket.io', 'http://localhost:4000'],
      // credentials: true
      origin: '*'
    }
  });

  instrument(io, {
    auth: false
  });

  // define header
  // io.engine.on('headers', (headers, req) => {
  //   headers['kkk'] = 'kuangpeng';
  // });

  // listen socket connection event
  io.on('connection', (socket) => {
    // socket.join('room1');
    // debug(socket.nsp.name);

    // debug for dev
    socket.onAny((eventName, ...args) => {
      debug(`socket event: ${eventName} ----- args: ${args}`);
    });

    // listen socket disconnect event
    socket.on('disconnect', () => {
      debug('socket disconnet!');
    });
  });

  handlers(io);
};
