export class Message {
  body = ''
  sender = ''
  receiver = ''
  groupId = ''
  chatType = ''
  sendAt = ''
  name = ''
  avatar = ''

  /**
   *
   * @param {Object} messageData
   * @param {String} messageData.body
   * @param {String} messageData.sender
   * @param {String} messageData.receiver
   * @param {String} messageData.groupId
   * @param {String} messageData.chatType
   */
  constructor(messageData) {
    this.body = messageData.body
    this.sender = messageData.sender
    this.chatType = messageData.chatType
    this.sendAt = messageData.sendAt || new Date()
    this.name = messageData.name
    this.avatar = messageData.avatar

    if (messageData.chatType === 'person') {
      this.receiver = messageData.receiver
    } else {
      this.groupId = messageData.groupId
    }
  }
}

class Chat {
  _id = ''
  id = ''
  remark = ''
  avatar = ''
  chatType = ''
  sender = ''
  messages = []
  uname = ''
  uavatar = ''
  isReceived = false

  constructor(chatInfo) {
    this._id = chatInfo._id
    this.id = chatInfo.id
    this.remark = chatInfo.remark
    this.avatar = chatInfo.avatar
    this.chatType = chatInfo.chatType
    this.sender = chatInfo.uid
    this.uname = chatInfo.uname
    this.uavatar = chatInfo.uavatar
  }

  talk(body) {}

  receive(body) {}

  initMessages(records) {
    this.messages = (records || []).map((m) => {
      return new Message({
        _id: m._id,
        body: m.body,
        sender: m.sender,
        receiver: m.receiver,
        chatType: m.chatType,
        groupId: m.groupId,
        sendAt: m.createAt,
        name: m.senderInfo.name,
        avatar: m.senderInfo.avatar
      })
    })
  }
}

export class ChatPerson extends Chat {
  /**
   *
   * @param {Object} chatPerson
   * @param {String} chatPerson._id
   * @param {String} chatPerson.contactId
   * @param {String} chatPerson.remark
   * @param {String} chatPerson.avatar
   * @param {String} chatPerson.uid 当前登录用户id
   */
  constructor(chatPerson) {
    super({
      id: chatPerson.contactId,
      chatType: 'person',
      ...chatPerson
    })
  }

  getMessageIns(message) {
    if (message.body) {
      return new Message({
        _id: message._id,
        body: message.body,
        sender: message.sender,
        receiver: message.receiver,
        chatType: message.chatType,
        name: message.senderInfo.name,
        avatar: message.senderInfo.avatar
      })
    } else {
      return new Message({
        _id: new Date().getTime(),
        body: message,
        sender: this.sender,
        receiver: this.id,
        chatType: 'person',
        name: this.uname,
        avatar: this.uavatar
      })
    }
  }

  talk(message) {
    return this.getMessageIns(message)
  }

  receive(response) {
    return this.getMessageIns(response)
  }
}

export class ChatGroup extends Chat {
  nickName = ''

  /**
   *
   * @param {Object} chatGroup
   * @param {String} chatGroup._id
   * @param {String} chatGroup.groupId
   * @param {String} chatGroup.remark
   * @param {String} chatGroup.avatar
   * @param {String} chatGroup.owner
   * @param {String} chatGroup.nickname
   * @param {String} chatGroup.membersInfo
   */
  constructor(chatGroup) {
    super({
      id: chatGroup.groupId,
      chatType: 'group',
      ...chatGroup
    })
    this.membersInfo = chatGroup.membersInfo
    this.nickName = chatGroup.nickName
  }

  getMessageIns(message) {
    if (message.body) {
      return new Message({
        _id: message._id,
        body: message.body,
        sender: message.sender,
        groupId: message.groupId,
        chatType: message.chatType,
        name: message.senderInfo.name,
        avatar: message.senderInfo.avatar
      })
    } else {
      return new Message({
        _id: new Date().getTime(),
        body: message,
        sender: this.sender,
        groupId: this.id,
        chatType: 'group',
        name: this.uname,
        avatar: this.uavatar
      })
    }
  }

  talk(message) {
    return this.getMessageIns(message)
  }

  receive(response) {
    return this.getMessageIns(response)
  }
}

export class ChatMain {
  chatList = ref([])
  chatListRef = reactive({})
  uid = ''
  uname = ''
  uavatar = ''

  constructor(loginUser) {
    this.uid = loginUser.uid
    this.uname = loginUser.name
    this.uavatar = loginUser.avatar
  }

  saveChat(data) {
    let newChat

    data['uid'] = this.uid
    data['uname'] = this.uname
    data['uavatar'] = this.uavatar

    if (data.chatType === 'person') {
      newChat = new ChatPerson(data)
    } else {
      newChat = new ChatGroup(data)
    }

    this.chatList.value.push(newChat)
    this.chatListRef[newChat.id] = newChat

    return newChat
  }

  findChat(id) {
    let chat = this.chatListRef[id]

    return chat
  }

  removeChat(id) {
    const index = this.chatList.value.findIndex((cl) => cl.id === id)

    if (index > -1) {
      this.chatList.value.splice(index, 1)
      delete this.chatListRef[id]
    }
  }

  // setTopChat(id) {
  //   const index = this.chatList.value.findIndex((cl) => cl.id === id)

  //   if (index > -1) {
  //     const chat = this.chatList.value[index]

  //     this.chatList.value.splice(index, 1)
  //     this.chatList.value.unshift(chat)
  //   }
  // }
}
