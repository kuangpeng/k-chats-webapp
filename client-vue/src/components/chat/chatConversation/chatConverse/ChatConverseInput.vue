<template>
  <div flex justify-between p-1 gap-x-1>
    <textarea rows="2" resize="none" v-model="message" flex-grow p-1 rd border-1 border-solid border-gray-300 bg-white focus:border-primary></textarea>
    <!-- <button type="button" w-20 p-2 rd border-1 border-solid border-gray-2 bg-white >
      发 送
    </button> -->
    <k-button w-20 p-2 type="primary" @click="handleSendMessage">发 送</k-button>
  </div>
</template>

<script setup>
import converse from '@/modules/converse'

const emit = defineEmits('updateMessage')

const chatInfo = inject('chatInfo')

const message = ref('')

const handleSendMessage = () => {
  if (!message.value) return false
  
  converse.talk(chatInfo.value.id, message.value)

  message.value = ''

  emit('updateMessage')
}
</script>

<style lang=""></style>
