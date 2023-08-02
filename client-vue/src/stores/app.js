import { defineStore } from 'pinia'
import { useContactsStore } from './contacts'
import { useConversationStore } from './conversation'
import converse from '@/modules/converse'

export const PANELS = {
  CONTACT: 'contact',
  CONVERSE: 'converse'
}

export const useAppStore = defineStore('app', () => {
  const contactsStore = useContactsStore()
  const conversationStore = useConversationStore()

  async function initChat() {
    contactsStore.initContacts()
    contactsStore.initGroups()
    // await conversationStore.initHistoryChats()

    converse.init()
  }

  const activePanel = ref(PANELS.CONVERSE)

  function changeActivePanel(p) {
    if (Object.values(PANELS).indexOf(p) === -1) return false
    if (activePanel.value === p) return false
    activePanel.value = p
  }

  return {
    initChat,
    activePanel,
    changeActivePanel
  }
})
