<template>
  <div class="chat-main" w-3xl h-120 bg-light-50 rd overflow-hidden flex>
    <chat-sider />
    <div bg-red-400 flex grow-1>
      <component :is="componentId" grow-1 />
    </div>
  </div>
</template>

<script setup>
import { useAppStore, PANELS } from '@/stores/app'
import ChatContacts from './chatContacts/ChatContacts.vue'
import ChatConversation from './chatConversation/ChatConversationContainer.vue'

const appStore = useAppStore()

const componentList = {
  [PANELS.CONTACT]: ChatContacts,
  [PANELS.CONVERSE]: ChatConversation
}

const componentId = computed(() => componentList[appStore.activePanel])
</script>
