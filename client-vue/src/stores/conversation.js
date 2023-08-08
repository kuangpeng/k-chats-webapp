import { defineStore } from 'pinia'

import { getChats } from '@/api/chat'

export const useConversationStore = defineStore('conversation', () => {
  const chatList = ref([])
  const historyChats = ref([])

  const activeChatUser = reactive({
    id: '',
    name: '',
    chatType: ''
  })

  function reset() {
    chatList.value = []
    historyChats.value = []

    activeChatUser.id = ''
    activeChatUser.name = ''
    activeChatUser.chatType = ''
  }

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

  function findChat(id) {
    return chatList.value.find((cl) => cl.id === id)
  }

  /**
   *
   * @param {*} id
   * @param {Object} updateVal
   * @param {String} updateVal.key 修改的键名
   * @param {String} updateVal.val 修改的值
   */
  function updateChat(id, updateVal) {
    const chat = findChat(id)

    if (chat) {
      chat[updateVal.key] = updateVal.val
    }
  }

  function findHistoryByChat(id, chatType) {
    const chat = historyChats.value.find((hc) => {
      if (hc.chatType === chatType) {
        return hc.contact === id
      } else {
        return hc.groupId === id
      }
    })

    return chat.records || []
  }

  function addNewChat(chat) {
    if (chatList.value.findIndex((c) => c.id === chat.id) > -1) return false

    chatList.value.unshift(chat)
  }

  /**
   *
   * @param {*} id
   * @param {*} newMessage
   * @param {Boolean} isReceive 是否为接收的消息, 默认false
   */
  function addNewMessage(id, newMessage, isReceive) {
    const chat = findChat(id)

    chat.messages.push(newMessage)

    isReceive && (chat.isReceived = true)
  }

  function setMessageReaded(id) {
    const chat = findChat(id)
    chat.isReceived = false
  }

  function changeActiveChatUser(chat) {
    activeChatUser.id = chat.id
    activeChatUser.name = chat.name
    activeChatUser.chatType = chat.chatType
  }

  return {
    chatList,
    historyChats,
    activeChatUser,
    reset,
    initHistoryChats,
    changeActiveChatUser,
    setMessageReaded,
    addNewChat,
    findChat,
    addNewMessage,
    findHistoryByChat,
    updateChat
  }
})
