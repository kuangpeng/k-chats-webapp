<template>
  <div p-2 py-3 flex gap-x-1 :class="{ self: self, group: chatInfo.chatType == 'group' }">
    <k-avatar :src="avatar" :alt="name" shape="circle" w-9 h-9 />
    <div>
      <div v-if="chatInfo.chatType == 'group'" class="name" text-3 line-height-none mb-1>{{ name }}</div>
      <div class="body">
        <div class="body-main">
          {{ body }}
        </div>
        <span class="arrow" z-3></span>
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

const chatInfo = inject('chatInfo')

const userStore = useUserStore()

const self = computed(() => {
  return props.sender === userStore.uid
})
</script>

<style scoped lang="less">
.body {
  @apply relative text-left pl-1;
}
.body-main{
  @apply relative z-2 flex-inline items-center max-w-60 min-h-8 bg-white rd-1 px-3 py-2 lh-5 border-1 border-solid border-gray-100;
}
.arrow{
  top: 0.875rem;
  @apply absolute w-2 h-2 left-0;
  &::before{
    @apply content-empty absolute w-2 h-2 overflow-hidden bg-white border-1 border-solid border-gray-100 left-0 top-0 rotate-45;
    border-bottom-left-radius: 1px;
    border-top-color: transparent;
    border-right-color: transparent;
  }
}

.self {
  @apply flex-row-reverse text-right;

  .body{
    @apply pl-0 pr-1 flex justify-end;
  }

  .body-main {
    @apply border-success-500 bg-success-500 c-light;
  }

  .arrow{
    @apply left-auto right-0;

    &::before{
      @apply bg-success-500 border-success-500 rotate-135;
    }
  }
}

.group{
  .arrow{
    @apply top-2;
  }
}
</style>
