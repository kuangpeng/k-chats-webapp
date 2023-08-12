<template>
  <div class="chat-main" w-4xl h-xl bg-light-50 rd overflow-hidden flex justify-center>
    <chat-sider />
    <div relative flex grow-1 v-loading="loading">
      <component :is="componentId" grow-1 />
    </div>
  </div>
</template>

<script setup>
import { useAppStore, PANELS } from '@/stores/app'
import ChatContacts from './chatContacts/ChatContacts.vue'
import ChatConversation from './chatConversation/ChatConversationContainer.vue'

const appStore = useAppStore()

defineProps({
  loading: {
    type: Boolean,
    default: false
  }
})

const componentList = {
  [PANELS.CONTACT]: ChatContacts,
  [PANELS.CONVERSE]: ChatConversation
}

const componentId = computed(() => componentList[appStore.activePanel])
</script>
