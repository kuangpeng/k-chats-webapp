const contact = {
  ADD: 'contact:add',
  ON_NEW: 'contact:new'
};

const group = {
  JOIN: 'group:join',
  CREATE: 'group:create'
};

const chat = {
  TALK: 'chat:talk'
};

const HANDLERTYPE = {
  CONTACT: {
    ...contact
  },
  GROUP: {
    ...group
  },
  CHAT: {
    ...chat
  }
};

module.exports = HANDLERTYPE;
