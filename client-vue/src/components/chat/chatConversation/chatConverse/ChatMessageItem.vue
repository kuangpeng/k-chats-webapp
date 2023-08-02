<template>
  <div p-2 flex gap-x-1 :class="{ self: self }">
    <img :src="avatar" :alt="name" w-10 h-10 rounded-full overflow-hidden border-1 border-solid border-primary-100 />
    <div>
      <div class="name" text-3 line-height-none mb-1>{{ name }}</div>
      <div class="body" flex-inline max-w-60 bg-white rd-3 px-2 py-1 lh-4 border-1 border-solid border-gray-100>
        {{ body }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'

const props = defineProps({
  sender: String,
  name: String,
  avatar: String,
  body: String
})

const userStore = useUserStore()

const self = computed(() => {
  return props.sender === userStore.uid
})
</script>

<style scoped lang="less">
.body {
  text-align: left;
}

.self {
  flex-direction: row-reverse;

  text-align: right;

  .body {
    border-color: var(--c-color-success-500);
    background-color: var(--c-color-success-500);
    color: var(--color-background);
  }
}
</style>
