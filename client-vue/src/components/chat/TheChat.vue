<template>
  <div class="chat-main" w-4xl h-xl bg-light-50 rd overflow-hidden flex justify-center>
    <chat-sider />
    <div relative flex grow-1>
      <component :is="componentId" grow-1 />
      <div v-show="loading" class="bg-white/90" absolute top-0 left-0 bottom-0 right-0 z-100 flex justify-center items-center text-3xl c-primary-500>
        <div i-svg-spinners:3-dots-rotate></div>
      </div>
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
