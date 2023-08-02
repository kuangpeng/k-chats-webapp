<template>
  <div class="conversation-container" bg-blue-3 flex>
    <chat-conversation-list bg-white w-60 />
    <div flex grow-1>
      <KeepAlive>
        <component :is="activeConverse"></component>
      </KeepAlive>
    </div>
    <!-- <chat-converse  /> -->
  </div>
</template>

<script setup>
import { useConversationStore } from '@/stores/conversation'
import ChatConverse from './chatConverse/ChatConverse.vue'
import ChatConverseEmpty from './chatConverse/ChatConverseEmpty.vue'

const conversationStore = useConversationStore()

// const chatList = computed(() => conversationStore.chatList)

const converseWindowList = computed(() => {
  let data = {}
  conversationStore.chatList.forEach((chat) => {
    let id = chat.id
    data[id] = h(ChatConverse, {
      id: id,
      chatType: chat.chatType,
    })
  })

  return data
})

const activeConverse = computed(() => {
  let id = conversationStore.activeChatUser.id
  return id ? converseWindowList.value[id] : ChatConverseEmpty
})
</script>
