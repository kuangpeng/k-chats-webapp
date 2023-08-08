<template>
  <div flex flex-col>
    <h3 px-4 py-3 text-5 font-bold>消 息</h3>
    <div overflow-auto grow-1>
      <template v-for="(chat, key) in chatList" :key="key">
        <chat-conversation-item :class="{ active: isActiveContact(chat) }" v-bind="chat" border-0 border-b-1 border-dotted border-gray-100 last:border-none @click="handleChat(chat)" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { useConversationStore } from '@/stores/conversation'

const conversationStore = useConversationStore()

const chatList = computed(() => conversationStore.chatList)

const activeUser = computed(() => conversationStore.activeChatUser)

const isActiveContact = computed(() => (chat) => {
  return activeUser.value.id === chat.id
})

const handleChat = (chat) => {
  conversationStore.changeActiveChatUser({
    id: chat.id,
    name: chat.remark,
    chatType: chat.chatType
  })
}
</script>

<style lang=""></style>
