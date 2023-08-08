import { useAppStore, PANELS } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { useConversationStore } from '@/stores/conversation'
import { useContactsStore } from '@/stores/contacts'
import { ACTIONTYPE, send } from './socket'
import { ChatMain } from './chat'
import { createContact, createGroup, default as contactModule } from './contact'

let isInit = false
let chatMain = null

const reset = () => {
  isInit = false

  chatMain = null
}

const init = async () => {
  if (isInit) return false

  initChat()

  initChatHistory()

  isInit = true
}

const initChat = () => {
  const userStore = useUserStore()

  chatMain = new ChatMain({
    uid: userStore.uid,
    name: userStore.userName,
    avatar: userStore.avatar
  })
}

const initChatHistory = () => {
  const conversationStore = useConversationStore()

  conversationStore.historyChats.forEach((hc) => {
    const contact = hc.chatType === 'person' ? createContact(hc) : createGroup(hc)

    const newChat = chatMain.saveChat({ chatType: hc.chatType, ...contact })

    newChat.initMessages(hc.records)

    conversationStore.addNewChat(newChat)
  })
}

const focusChat = (activeChat) => {
  const appStore = useAppStore()
  const conversationStore = useConversationStore()

  //  switch panel
  appStore.changeActivePanel(PANELS.CONVERSE)

  // await nextTick()
  conversationStore.changeActiveChatUser(activeChat)
}

// 从联系人列表发起聊天
const startTalk = async (payload) => {
  const contactsStore = useContactsStore()
  const conversationStore = useConversationStore()

  let activeChat = {
    id: '',
    name: '',
    chatType: payload.chatType
  }

  if (payload.chatType === 'person') {
    const contact = contactsStore.findContact(payload.id)
    const newContact = chatMain.saveChat({ chatType: 'person', ...contact })

    activeChat.id = contact.contactId
    activeChat.name = newContact.remark

    conversationStore.addNewChat(newContact)
  } else {
    const group = contactsStore.findGroup(payload.id)
    const newGroup = chatMain.saveChat({ chatType: 'group', ...group })

    activeChat.id = group.groupId
    activeChat.name = newGroup.remark

    conversationStore.addNewChat(newGroup)
  }

  focusChat(activeChat)
}

// 发消息
const talk = (id, message) => {
  const conversationStore = useConversationStore()

  const chat = chatMain.findChat(id)

  const newMessage = chat.talk(message)

  conversationStore.addNewMessage(id, newMessage)

  send(ACTIONTYPE.CHAT.TALK, newMessage)
}

// 接收新消息
const receive = (response) => {
  const conversationStore = useConversationStore()
  // 1 判断会话列表是否有此联系人
  const { sender, groupId, chatType } = response

  const id = chatType === 'person' ? sender : groupId
  let chat = chatMain.findChat(id)

  // 1 -1若无，新增此联系人会话
  if (!chat) {
    const contactsStore = useContactsStore()

    const nc = chatType === 'person' ? contactsStore.findContact(id) : contactsStore.findGroup(id)

    chat = chatMain.saveChat(nc)

    conversationStore.addNewChat(chat)
  }

  // 2 向此联系人会话消息列表中新增消息
  const newMessage = chat.receive(response)

  conversationStore.addNewMessage(chat.id, newMessage, true)

  // 3 提醒新消息
}

// 发起群聊
const launchGroup = (ids) => {
  return new Promise((resolve, reject) => {
    let newGroup = {
      members: ids
    }

    send(ACTIONTYPE.GROUP.CREATE, newGroup)
      .then((res) => {
        // 更新群列表
        const group = contactModule.addNewGroup(res)

        addNewGroupChat(group)

        resolve()
      })
      .catch(reject)
  })
}

const addNewContactChat = (contact) => {
  const conversationStore = useConversationStore()

  const newContactChat = chatMain.saveChat({ chatType: 'person', ...contact })

  conversationStore.addNewChat(newContactChat)

  // 显示群聊框
  let activeChat = {
    id: contact.contactId,
    name: contact.remark,
    chatType: 'group'
  }

  focusChat(activeChat)
}

const addNewGroupChat = (group) => {
  const conversationStore = useConversationStore()
  // 添加group chat
  const newGroup = chatMain.saveChat({ chatType: 'group', ...group })

  conversationStore.addNewChat(newGroup)

  // 显示群聊框
  let activeChat = {
    id: group.groupId,
    name: group.remark,
    chatType: 'group'
  }

  focusChat(activeChat)
}

/**
 *
 * @param {*} id
 * @param {String} chatType
 * @param {Object} updateVal
 * @param {String} updateVal.key 修改的键名
 * @param {String} updateVal.val 修改的值
 *
 */
const updateChatRemark = (id, chatType, updateVal) => {
  const conversationStore = useConversationStore()
  const contactsStore = useContactsStore()

  conversationStore.updateChat(id, updateVal)
  if (chatType === 'person') {
    contactsStore.updateContact(id, updateVal)
  } else {
    contactsStore.updateGroup(id, updateVal)
  }
}

export default {
  init,
  reset,
  receive,
  startTalk,
  talk,
  launchGroup,
  addNewContactChat,
  addNewGroupChat,
  updateChatRemark
}
