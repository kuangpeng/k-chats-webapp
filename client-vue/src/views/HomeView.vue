<template>
  <div screen-full flex justify-center items-center>
    <the-chat :loading="loading" />
  </div>
</template>

<script setup>
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

const loading = ref(true)

appStore.initChat().then(() => {
  setTimeout(() => {
    loading.value = false
  }, 100)
})

</script>
