<template>
  <div flex w-full px-8 py-5 transition-top ease-in-out duration-300 bg-white>
    <div relative w-full min-h-0 flex flex-col>
      <div grid grid-cols-3 gap-x-5>
        <chat-contact-item v-for="item in strangersList" :key="item._id" v-bind="{ mode: 'add', ...item }" />
      </div>

      <div absolute left-0 right-0 bottom-0 py-2 flex justify-center gap-x-5 bg-white>
        <k-button icon="i-bi:arrow-left" @click="$emit('back')">返 回</k-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContactsStore } from '@/stores/contacts'

const contactsStore = useContactsStore()

const strangersList = computed(() => contactsStore.strangers)
</script>

<style scoped>
.show {
  top: 0;
}
</style>
