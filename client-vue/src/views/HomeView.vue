<template>
  <div h-screen flex flex-justify-center flex-items-center>
    <the-chat />
  </div>
</template>

<script setup>
import socket from '@/modules/socket'
import { useAppStore } from '@/stores/app'

const appStore = useAppStore()

appStore.initChat()

socket()
</script>
