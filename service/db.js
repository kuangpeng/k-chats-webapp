const mongoose = require('mongoose');
const debug = require('debug')('app:db');

const uri = process.env.MONGODB_URI;

const start = () => {
  mongoose
    .connect(uri, {
      dbName: 'k-chat'
    })
    .then((connection) => {
      debug('connect:', 'db connect success!');
    })
    .catch((err) => {
      debug('connectError:', 'db connect fail!', err);
    });
};

module.exports = {
  start
};
