export class Message {
  body = ''
  sender = ''
  receiver = ''
  groupId = ''
  chatType = ''
  sendAt = ''

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

  constructor(chatInfo) {
    this._id = chatInfo._id
    this.id = chatInfo.id
    this.remark = chatInfo.remark
    this.avatar = chatInfo.avatar
    this.chatType = chatInfo.chatType
    this.sender = chatInfo.uid
  }

  talk(body) {}

  receive(body) {}

  addNewMessage(message) {
    this.messages.push(message)
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

  talk(message) {
    const m = new Message({
      body: message,
      sender: this.sender,
      receiver: this.id,
      chatType: this.chatType
    })

    this.addNewMessage(m)

    return m
  }

  receive(response) {
    const m = new Message({
      body: response.body,
      sender: response.sender,
      receiver: response.receiver,
      chatType: response.chatType
    })

    this.addNewMessage(m)
  }
}

export class ChatGroup extends Chat {
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
  }

  talk(message) {
    const m = new Message({
      body: message,
      sender: this.sender,
      groupId: this.id,
      chatType: this.chatType
    })

    this.addNewMessage(m)
  }
}

export class ChatMain {
  chatList = ref([])
  chatListRef = reactive({})
  uid = ''

  constructor(loginUid) {
    this.uid = loginUid
  }

  saveChat(data) {
    let newChat

    data['uid'] = this.uid

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
