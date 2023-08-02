import socket from '@/utils/socketRequest'
import { useUserStore } from '@/stores/user'

import converse from './converse'
import contact from './contact'

export const ACTIONTYPE = {
  CONTACT: {
    ADD: 'contact:add',
    ON_NEW: 'contact:new'
  },
  GROUP: {
    CREATE: 'group:create',
    ON_JOIN: 'group:join'
  },
  CHAT: {
    TALK: 'chat:talk',
    ON_RECEIVE: 'receive'
  }
}

const registerEmit = (eventType, payload) => {
  return new Promise((resolve, reject) => {
    socket.emit(eventType, payload, (err, response) => {
      if (err) return reject(err)

      resolve(response)
    })
  })
}

const registerOn = (eventType, callback) => {
  socket.on(eventType, (payload) => {
    callback(payload)
  })
}

export const send = (eventType, payload) => {
  return registerEmit(eventType, payload)
}

const start = () => {
  if (!socket.connected) {
    const userStore = useUserStore()

    socket.auth = {
      id: userStore.uid,
      name: userStore.userName,
      token: userStore.token
    }

    registerOn(ACTIONTYPE.CHAT.ON_RECEIVE, converse.receive)
    // 接收消息
    // socket.on('receive', (payload) => {
    //   conversationStore.receive(payload)
    // })

    registerOn(ACTIONTYPE.CONTACT.ON_NEW, contact.onNewContact)
    // socket.on('contact:new', (payload) => {
    //   contactsStore.newContactAdd(payload)
    // })

    registerOn(ACTIONTYPE.GROUP.ON_JOIN, contact.onJoinGroup)
    // socket.on('group:new', (payload) => {
    //   conversationStore.newGroupAdd(payload)
    // })

    socket.connect()
  }
}

export default start
