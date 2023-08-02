<template>
  <div relative flex flex-col justify-between px-8 py-5>
    <div grid grid-cols-3 gap-x-5>
      <chat-contact-item v-for="item in contactsList" :key="item.contactId" v-bind="{ mode: 'chat', ...item }" />
    </div>
    <div flex justify-center gap-x-5>
      <button type="button" border-1 border-solid border-warmGray-1 px-2 py-1 rd bg-white hover:bg-primary-300
        @click="handleShowStrangerList">
        <div class="i-bi:plus"></div>
        添加好友
      </button>
      <button type="button" border-1 border-solid border-warmGray-1 px-2 py-1 rd bg-warning-300 hover:bg-primary-300
        @click="handleStartGroupChat">
        <div class="i-bi:people"></div>
        发起群聊
      </button>
    </div>
    <chat-add-stranger absolute class="w-100% h-100% left-0 top-100%" :class="{ show: isShowStranger }"
      @back="handleBack" />
    <chat-launch-group-chat absolute class="w-100% h-100% left-0 top-100%" :class="{ show: isShowGroupSets }"
      @back="handleGroupBack" @launchGroup="handleLaunchGroup" />
  </div>
</template>

<script setup>
import { useContactsStore } from '@/stores/contacts'
import { useConversationStore } from '@/stores/conversation'

const contactsStore = useContactsStore()
const conversationStore = useConversationStore()

const contactsList = computed(() => contactsStore.contacts)

const isShowStranger = ref(false)
const handleShowStrangerList = () => {
  contactsStore.initStrangers()
  isShowStranger.value = !isShowStranger.value
}

const handleBack = () => {
  isShowStranger.value = !isShowStranger.value
}

const isShowGroupSets = ref(false)
const handleStartGroupChat = () => {
  isShowGroupSets.value = true
}

// 确认发起群聊
const handleLaunchGroup = (ids) => {
  conversationStore.launchGroupChat(ids).then(() => {
    isShowGroupSets.value = false
  })
}

const handleGroupBack = () => {
  isShowGroupSets.value = !isShowGroupSets.value
}
</script>
<style lang=""></style>
