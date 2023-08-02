import { defineStore } from 'pinia'
import { useAppStore } from './app'
import { useUserStore } from './user'

import { getChats } from '@/api/chat'
import { useContactsStore } from './contacts'

export const useConversationStore = defineStore('conversation', () => {
  const appStore = useAppStore()
  const userStore = useUserStore()
  const contactsStore = useContactsStore()

  const chatList = ref([])
  let historyChats = ref([])

  function initHistoryChats() {
    return new Promise((resolve, reject) => {
      getChats()
        .then((res) => {
          historyChats.value = res.data

          resolve()
        })
        .catch((err) => {
          console.error('getChats', err)
          reject(err)
        })
    })
  }

  function initChats() {
    const currentUserId = userStore.uid

    // 个人消息
    contactsStore.contacts.forEach((c) => {
      let contactChats = historyChats.value.filter(
        (hc) =>
          hc.chatType === 'person' &&
          (hc.sender === c.contact || (hc.sender === currentUserId && hc.receiver === c.contact))
      )

      if (contactChats && contactChats.length > 0) {
        chatList.push({
          messages: contactChats,
          chatType: 'person',
          isReceived: false,
          ...c
        })
      }
    })

    // 群消息
    contactsStore.groups.forEach((g) => {
      let groupChats = historyChats.value.filter(
        (hc) => hc.chatType === 'group' && hc.groupId === g.groupId
      )

      chatList.push({
        messages: groupChats,
        chatType: 'group',
        isReceived: false,
        ...g
      })
    })
  }

  function findChat(id) {
    return chatList.value.find((cl) => cl.id === id)
  }

  const activeChatUser = reactive({
    id: '',
    name: '',
    chatType: ''
  })

  function changeActiveChatUser(chat) {
    activeChatUser.id = chat.id
    activeChatUser.name = chat.name
    activeChatUser.chatType = chat.chatType
  }

  // TODO:
  function startTalk(contactInfo) {
    console.log(contactInfo)
    const { id, chatType, name } = contactInfo

    if (chatType === 'person') {
      let contactObj = contactsStore.contacts.filter((c) => c.contact === id)

      chatList.push({
        messages: [],
        chatType: 'person',
        ...contactObj[0]
      })
    } else if (chatType === 'group') {
      // group chat
      // let groupIndex = chatList.findIndex(c => c.groupId === id)
      // if (groupIndex === -1) {
      //   let groupObj = contactsStore.groups.find((cg) => cg.groupId === id)
      //   chatList.push({
      //     messages: [],
      //     chatType: 'group',
      //     ...groupObj
      //   })
      // }
    }

    nextTick(() => {
      appStore.changeActivePanel('conversation')

      changeActiveChatUser({
        id,
        name,
        chatType
      })
    })
  }

  // 发送消息
  // function talk(message) {
  //   let postData = {
  //     body: message,
  //     sendAt: new Date(),
  //     chatType: activeChatUser.chatType
  //   }

  //   let i = -1
  //   if (activeChatUser.chatType === 'person') {
  //     postData['receiver'] = activeChatUser.id
  //     i = chatList.findIndex((c) => c.contact === activeChatUser.id)
  //   } else {
  //     postData['groupId'] = activeChatUser.id
  //     i = chatList.findIndex((c) => c.groupId === activeChatUser.id)
  //   }

  //   // add message to local chat list
  //   // 模拟消息数据结构
  //   let newMessage = {
  //     body: message,
  //     sender: userStore.uid,
  //     senderInfo: {
  //       name: userStore.userName,
  //       avatar: userStore.avatar
  //     }
  //   }

  //   chatList[i].messages.push(newMessage)

  //   socket.emit('talk', postData, () => {
  //     // 返回的消息数据（完整）
  //     // chatList[i].messages.push(response)
  //   })
  // }

  // 接收消息
  function receive(payload) {
    if (payload.chatType === 'person') {
      let chat = chatList.find((cl) => cl.chatType === 'person' && cl.contact === payload.sender)

      if (chat) {
        chat.messages.push(payload)
        chat.isReceived = true
      } else {
        // add new contact and start talk
        let contactObj = contactsStore.contacts.find((c) => c.contact === payload.sender)

        chatList.push({
          messages: [payload],
          chatType: 'person',
          isReceived: true,
          ...contactObj
        })
      }
    } else {
      // group message
      let chat = chatList.find((cl) => cl.chatType === 'group' && cl.groupId === payload.groupId)

      if (chat) {
        payload && chat.messages.push(payload)
        chat.isReceived = true
      } else {
        let groupObj = contactsStore.groups.find((cg) => cg.groupId === payload.groupId)

        chatList.push({
          messages: [payload],
          chatType: 'group',
          isReceived: true,
          ...groupObj
        })
      }
    }
  }

  function setMessageReaded(id, chatType) {
    if (chatType === 'person') {
      let chat = chatList.find((cl) => cl.chatType === 'person' && cl.contact === id)

      if (chat) {
        chat.isReceived = false
      }
    } else {
      let chat = chatList.find((cl) => cl.chatType === 'group' && cl.groupId === id)

      if (chat) {
        chat.isReceived = false
      }
    }
  }

  // 发起群聊
  function launchGroupChat(ids) {
    return new Promise((resolve, reject) => {
      try {
        let newGroup = {
          members: ids
        }

        socket.emit('group:create', newGroup, async (response) => {
          console.log('----------launch group----', response)
          await contactsStore.initGroups()

          chatList.push({
            messages: [],
            chatType: 'group',
            ...response
          })

          startTalk({
            id: response.groupId,
            name: response.remark,
            chatType: 'group'
          })

          resolve(response)
        })
      } catch (err) {
        reject(err)
      }
    })
  }

  // TODO: new group notify
  function newGroupAdd() {
    chatList.push({
      messages: [],
      chatType: 'group',
      isReceived: false
    })
  }

  function addNewChat(chat) {
    if (chatList.value.findIndex((c) => c.id === chat.id) > -1) return false

    chatList.value.unshift(chat)
  }

  function addNewMessage(id, newMessage) {
    const index = chatList.value.findIndex((c) => c.id === id)

    if (index === -1) return false

    chatList.value[index].messages.push(newMessage)
  }

  return {
    chatList,
    historyChats,
    initHistoryChats,
    activeChatUser,
    changeActiveChatUser,
    startTalk,
    // talk,
    receive,
    launchGroupChat,
    setMessageReaded,
    newGroupAdd,
    addNewChat,
    findChat,
    addNewMessage
  }
})
