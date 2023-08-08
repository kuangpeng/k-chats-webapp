<template>
  <div relative flex flex-col grow-1 min-h-0 @click="handleTouchMain">
    <div relative flex items-center h-12 bg-gray-100 px-4>
      <div text-5 v-show="!isEditingRemark">{{ contactName }}
        <k-button :text="true" title="修改备注" @click="handleUpdateRemark">
          <div i-bi:pencil-square c-gray-300 hover:c-danger-300></div>
        </k-button>
      </div>
      <div v-show="isEditingRemark" flex gap-1>
        <div w-50><input type="text" v-model="newRemak" class="k-input k-input-sm"/></div>
        <k-button size="sm" :loading="isUpdating" @click="handleConfirmUpdate">修改</k-button>
      </div>
      <button v-if="chatType === 'group'" type="button" absolute right-2 top-2 text-5 px-1 @click="handleOpenSidePanel">
        <div class="i-bi:three-dots"></div>
      </button>
    </div>
    <div :id="'messageList-' + id" ref="messageListBoxRef" flex-1 overflow-y-auto scrollbar-y @scroll="handleMessageBoxScroll">
      <chat-message-item v-for="(item) in messageList" :key="item._id" v-bind="item" />
    </div>
    <div v-show="isReceived" class="w-100%" absolute bottom-10 text-3 text-center bg-warning-200>
      有新消息
    </div>
    <chat-converse-input h-15 @updateMessage="handleUpdateMessage" />

    <div v-if="chatType === 'group'" class="side-panel" :class="{ visible: sidePanelVisible }" flex flex-col min-h-0 z-10
      absolute w-50 transition-right top-12 bottom-0 right--50 p-2 bg-second>
      <div>
        <div text-4 text-black>{{ contactName }}</div>
      </div>
      <div text-3 >成 员：</div>
      <div flex-1 overflow-y-auto my-1>
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
import { updateContact, updateGroup } from '@/api/contacts'
import converseModule from '@/modules/converse'

const conversationStore = useConversationStore()

const props = defineProps({
  id: String,
  chatType: String
})

const chatInfo = computed(() => conversationStore.findChat(props.id))

provide('chatInfo', chatInfo)

const contactName = computed(() => (chatInfo.value.remark || ''))

const messageList = computed(() => (chatInfo.value.messages || []))

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
    conversationStore.setMessageReaded(props.id)
  }
}

const handleTouchMain = () => {
  isReceived.value && conversationStore.setMessageReaded(props.id)
}

const sidePanelVisible = ref(false)
const handleOpenSidePanel = () => {
  sidePanelVisible.value = !sidePanelVisible.value
}

const newRemak = ref('')
const isEditingRemark = ref(false)
const isUpdating = ref(false)
const handleUpdateRemark = () => {
  newRemak.value = contactName.value
  isEditingRemark.value = true
}
const resetUpdate = () => {
  isEditingRemark.value = false
  newRemak.value = ''
  isUpdating.value = false
}
const handleConfirmUpdate = () => {
  isUpdating.value = true
  let newRemakVal = newRemak.value
  if (props.chatType === 'person') {
    updateContact(props.id, {
      remark: newRemak.value
    }).then(() => {
      converseModule.updateChatRemark(props.id, props.chatType, {
        key: 'remark',
        val: newRemakVal
      })
      resetUpdate()
    })
  } else {
    updateGroup(props.id, {
      remark: newRemak.value
    }).then(() => {
      converseModule.updateChatRemark(props.id, props.chatType, {
        key: 'remark',
        val: newRemakVal
      })
      resetUpdate()
    })
  }
}

</script>

<style scoped lang="less">
.side-panel.visible {
  right: 0;
}
</style>
