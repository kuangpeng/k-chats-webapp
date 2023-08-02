<template>
  <div flex justify-between p-1 gap-x-1>
    <input type="text" v-model="message" flex-grow p-2 rd border-1 boder-solid border-gray-2 bg-white />
    <button type="button" w-20 p-2 rd border-1 boder-solid border-gray-2 bg-white @click="handleSendMessage">
      发 送
    </button>
  </div>
</template>

<script setup>
import converse from '@/modules/converse'

const emit = defineEmits('updateMessage')

const chatInfo = inject('chatInfo')

const message = ref('')

const handleSendMessage = () => {
  converse.talk(chatInfo.value.id, chatInfo.value.chatType, message.value)

  message.value = ''

  emit('updateMessage')
}
</script>

<style lang=""></style>
