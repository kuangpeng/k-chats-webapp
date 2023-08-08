import { defineStore } from 'pinia'
import { useUserStore } from './user'
import { useContactsStore } from './contacts'
import { useConversationStore } from './conversation'
import converse from '@/modules/converse'
import socket from '@/modules/socket'

export const PANELS = {
  CONTACT: 'contact',
  CONVERSE: 'converse'
}

export const APP_CONFIG = {
  avatar_default: './images/avatar.png'
}

export const useAppStore = defineStore('app', () => {
  const contactsStore = useContactsStore()
  const conversationStore = useConversationStore()
  const activePanel = ref(PANELS.CONVERSE)

  function initChat() {
    return new Promise((resolve) => {
      Promise.all([
        contactsStore.initContacts(),
        contactsStore.initGroups(),
        conversationStore.initHistoryChats()
      ]).then(() => {
        converse.init()

        socket()

        resolve()
      })
    })
  }

  function resetApp() {
    const userStore = useUserStore()
    const contactsStore = useContactsStore()
    const conversationStore = useConversationStore()

    activePanel.value = PANELS.CONVERSE

    userStore.reset()
    contactsStore.reset()
    conversationStore.reset()

    converse.reset()
  }

  function changeActivePanel(p) {
    if (Object.values(PANELS).indexOf(p) === -1) return false
    if (activePanel.value === p) return false
    activePanel.value = p
  }

  return {
    initChat,
    activePanel,
    changeActivePanel,
    resetApp
  }
})
