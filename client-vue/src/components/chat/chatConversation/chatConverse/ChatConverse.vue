<template>
  <div relative flex flex-col grow-1 min-h-0 @click="handleTouchMain">
    <div relative flex justify-center items-center h-10 bg-green-200>
      <span>{{ contactName }}</span>
      <button v-if="chatType === 'group'" type="button" absolute right-2 top-2 text-5 px-1 @click="handleOpenSidePanel">
        <div class="i-bi:three-dots"></div>
      </button>
    </div>
    <div :id="'messageList-' + contactId" ref="messageListBoxRef" flex-1 overflow-y-auto @scroll="handleMessageBoxScroll">
      <chat-message-item v-for="(item, index) in messageList" :key="item._id" v-bind="item" />
    </div>
    <div v-show="isReceived" class="w-100%" absolute bottom-10 text-3 text-center bg-warning-200>
      有新消息
    </div>
    <chat-converse-input h-15 @updateMessage="handleUpdateMessage" />

    <div v-if="chatType === 'group'" class="side-panel" :class="{ visible: sidePanelVisible }" flex flex-col min-h-0
      absolute w-50 transition-right top-10 bottom-0 right--50 p-2 bg-pink-200>
      <div>
        <div text-3 text-gray-200>群名</div>
        <div text-4 text-black>{{ contactName }}</div>
      </div>
      <div flex-1 overflow-y-auto my-2>
        <div v-for="m in groupMembers" :key="m._id" flex items-center gap-x-1 py-1>
          <img class="h-6 w-6 mt-1 flex-none rounded-full bg-gray-50" :src="m.avatar" :alt="m.name" />
          <div class="min-w-0 flex-auto">
            <p class="line-clamp-1 text-sm font-semibold leading-6 text-gray-900">{{ m.name }}</p>
          </div>
        </div>
      </div>
      <!-- <button type="button" w-full py-2 rd>退 出</button> -->
    </div>
  </div>
</template>

<script setup>
import { useConversationStore } from '@/stores/conversation'

const conversationStore = useConversationStore()

const props = defineProps({
  id: String,
  chatType: String
})

const chatInfo = computed(() => conversationStore.findChat(props.id))
provide('chatInfo', chatInfo)

const contactName = computed(() => chatInfo.value.remark)

const messageList = computed(() => chatInfo.value.messages)

const groupMembers = computed(() => {
  if (props.chatType === 'group') {
    return chatInfo.value.membersInfo
  } else {
    return []
  }
})

const messageListBoxRef = ref(null)

const handleUpdateMessage = () => {
  // 发送消息后，消息列表滚动到最新位置
  nextTick(() => {
    let y = messageListBoxRef.value.scrollHeight
    messageListBoxRef.value.scrollTo({
      top: y,
      left: 0,
      behavior: 'smooth'
    })
  })
}

const isReceived = computed(() => chatInfo.value.isReceived)

const handleMessageBoxScroll = () => {
  if (isReceived.value) return false

  if (
    messageListBoxRef.scrollHeight - Math.round(messageListBoxRef.scrollTop) ===
    messageListBoxRef.clientHeight
  ) {
    conversationStore.setMessageReaded(props.contactId, props.chatType)
  }
}

const handleTouchMain = () => {
  isReceived.value && conversationStore.setMessageReaded(props.contactId, props.chatType)
}

const sidePanelVisible = ref(false)
const handleOpenSidePanel = () => {
  sidePanelVisible.value = !sidePanelVisible.value
}
</script>

<style scoped lang="less">
.side-panel.visible {
  right: 0;
}
</style>
