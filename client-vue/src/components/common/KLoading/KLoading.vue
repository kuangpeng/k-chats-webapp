<template>
  <div class="bg-white/90" absolute top-0 left-0 bottom-0 right-0 z-100 flex justify-center items-center text-center text-3xl c-primary-500>
    <div>
      <div i-svg-spinners:3-dots-rotate></div>
      <div text-sm indent-2 mt-2>{{ text }}</div>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'KLoading'
})

defineProps({
  text: {
    type: String,
    default: '加载中...'
  }
})
</script>