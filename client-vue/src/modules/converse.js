import { useAppStore, PANELS } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useConversationStore } from '@/stores/conversation'
import { useContactsStore } from '@/stores/contacts'
import { ACTIONTYPE, send } from './socket'
import { ChatMain } from './chat'

let isInit = false
let chatMain = null

export const createChat = (data) => {
  let val = {
    id: '',
    chatType: data.chatType,
    remark: data.remark,
    avatar: data.avatar,
    messages: []
  }

  if (data.chatType === 'person') {
    val.id = data.contactId
  } else {
    val.id = data.groupId
  }

  return val
}

export const createMessage = (data) => {
  const now = new Date()
  const res = {
    _id: data._id || now.getTime(),
    body: data.body,
    sender: data.sender,
    chatType: data.chatType,
    sendAt: now
  }

  if (data.chatType === 'person') {
    res['receiver'] = data.id || data.receiver
  } else {
    res['groupId'] = data.id || data.groupId
  }
  return res
}

const init = async () => {
  if (isInit) return false

  initChat()

  isInit = true
}

const initChat = () => {
  const userStore = useUserStore()

  chatMain = new ChatMain(userStore.uid)
}

// 从联系人列表发起聊天
const startTalk = async (payload) => {
  const appStore = useAppStore()
  const contactsStore = useContactsStore()
  const conversationStore = useConversationStore()

  let activeChat = {
    id: '',
    name: '',
    chatType: payload.chatType
  }

  if (payload.chatType === 'person') {
    const contact = contactsStore.findContact(payload.contactId)
    // const newContact = createChat(contact)
    const newContact = chatMain.saveChat({ chatType: 'person', ...contact })

    activeChat.id = contact.contactId
    activeChat.name = newContact.remark

    conversationStore.addNewChat(newContact)
  } else {
    const group = contactsStore.findGroup(payload.groupId)
    // const newGroup = createChat(group)
    const newGroup = chatMain.saveChat({ chatType: 'person', ...group })

    activeChat.id = group.groupId
    activeChat.name = newGroup.remark

    conversationStore.addNewChat(newGroup)
  }

  //  switch panel
  appStore.changeActivePanel(PANELS.CONVERSE)

  await nextTick()

  conversationStore.changeActiveChatUser(activeChat)
}

// 发消息
const talk = (id, chatType, message) => {
  const chat = chatMain.findChat(id)

  const newMessage = chat.talk(message)

  // const userStore = useUserStore()
  // const contactsStore = useContactsStore()
  // const conversationStore = useConversationStore()

  // const data = {
  //   body: message,
  //   chatType,
  //   sender: userStore.uid
  // }
  // if (chatType === 'person') {
  //   const contact = contactsStore.findContact(id)
  //   data.id = contact.contactId
  // } else {
  //   const group = contactsStore.findGroup(id)
  //   data.id = group.groupId
  // }

  // const newMessage = createMessage(data)

  // conversationStore.addNewMessage(id, newMessage)

  send(ACTIONTYPE.CHAT.TALK, newMessage)
}

// 接收新消息
const receive = (response) => {
  const conversationStore = useConversationStore()
  // 1 判断会话列表是否有此联系人
  const { sender, groupId, chatType } = response

  let id
  if (chatType === 'person') {
    id = sender
  } else {
    id = groupId
  }
  // let chat = conversationStore.findChat(id)
  let chat = chatMain.findChat(id)

  // 1 -1若无，新增此联系人会话
  if (!chat) {
    const contactsStore = useContactsStore()
    let nc
    if (chatType === 'person') {
      nc = contactsStore.findContact(id)
    } else {
      nc = contactsStore.findGroup(id)
    }

    // chat = createChat(nc)

    chat = chatMain.saveChat(nc)

    conversationStore.addNewChat(chat)
  }

  // 2 向此联系人会话消息列表中新增消息
  // conversationStore.addNewMessage(chat.id, createMessage(response))
  chat.receive(response)
  // 3 提醒新消息
}

export default {
  init,
  receive,
  startTalk,
  talk
}
