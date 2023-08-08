<template>
  <div relative flex flex-col min-h-0 px-8 pt-5 pb-12>
    <div text-sm color-gray mb-2>好友</div>
    <div v-if="contactsList.length > 0" grid grid-cols-3 gap-x-5 mb-3>
      <chat-contact-item v-for="item in contactsList" :key="item.contactId" v-bind="{ mode: 'chat', ...item }" />
    </div>
    <div text-sm color-gray mb-2>群聊</div>
    <div grid grid-cols-3 gap-x-5>
      <chat-contact-item v-for="item in groupList" :key="item.contactId" v-bind="{ mode: 'chat', ...item }" />
    </div>
    <div absolute left-0 right-0 bottom-0 py-2 flex justify-center gap-x-5 bg-white>
      <k-button icon="i-bi:plus" @click="handleShowStrangerList">添加好友</k-button>
      <k-button icon="i-bi:people" @click="handleStartGroupChat">发起群聊</k-button>
    </div>
    
    <chat-add-stranger absolute class="w-100% h-100% left-0 top-100%" :class="{ show: isShowStranger }"
      @back="handleBack" />
    <chat-launch-group absolute class="w-100% h-100% left-0 top-100%" :class="{ show: isShowGroupSets }"
      @back="handleGroupBack" @close="handleCloseLaunchGroup" />
  </div>
</template>

<script setup>
import { useContactsStore } from '@/stores/contacts'

const contactsStore = useContactsStore()

const contactsList = computed(() => contactsStore.contacts)

const groupList = computed(() => contactsStore.groups)

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
const handleCloseLaunchGroup = () => {
  isShowGroupSets.value = false
}

const handleGroupBack = () => {
  isShowGroupSets.value = !isShowGroupSets.value
}
</script>
<style lang=""></style>
