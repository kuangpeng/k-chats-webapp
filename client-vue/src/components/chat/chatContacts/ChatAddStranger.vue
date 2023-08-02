<template>
  <div flex flex-col justify-between px-8 py-5 transition-top ease-in-out duration-300 bg-yellow-300>
    <div grid grid-cols-3 gap-x-5>
      <chat-contact-item v-for="item in strangersList" :key="item._id" v-bind="{ mode: 'add', ...item }" />
    </div>

    <div text-center>
      <button type="button" @click="$emit('back')" border-1 border-solid border-warmGray-1 px-2 py-1 rd bg-white
        hover:bg-primary-300>
        <div class="i-bi:arrow-left"></div>
        返 回
      </button>
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
