<template>
  <div flex flex-col>
    <h3 px-4 py-2 text-5 font-bold>Messages</h3>
    <div overflow-auto grow-1>
      <template v-for="(chat, key) in chatList" :key="key">
        <chat-conversation-item :class="{ active: isActiveContact(chat) }" v-bind="chat" @click="handleChat(chat)" />
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
