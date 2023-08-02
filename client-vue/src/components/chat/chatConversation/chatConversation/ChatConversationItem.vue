<template>
  <div flex justify-between px-4 py-1 cursor-pointer hover:bg-gray-50>
    <div class="flex gap-x-2">
      <img class="h-8 w-8 mt-1 flex-none rounded-full bg-gray-50" :src="avatar" :alt="name" />
      <div class="min-w-0 flex-auto">
        <p class="line-clamp-1 text-sm font-semibold leading-6 text-gray-900">{{ name }}</p>
        <p class="h-8 line-clamp-2 text-xs leading-3.5 text-gray-500"></p>
      </div>
    </div>
    <div class="hidden sm:flex sm:flex-col sm:items-end">
      <p class="text-sm leading-5 text-gray-900">16:45</p>
      <div v-show="isReceived" class="text-xs flex">
        <div class="i-bi:exclamation-circle-fill" text-success-600></div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  _id: String,
  chatType: String,
  remark: String,
  avatar: String,
  isReceived: Boolean
})

const name = computed(() => {
  return props.remark
})

</script>

<style scoped lang="less">
.active {
  background-color: var(--c-color-info-100);
}
</style>
