const uri = process.env.URI;
const port = process.env.PORT;

const url = `${uri}:${port}`;

module.exports = {
  locUri: url,
  user: {
    avatar: {
      default: '/files/default/avatar.png'
    }
  },
  group: {
    avatar: {
      default: '/files/default/group.png'
    }
  }
};
