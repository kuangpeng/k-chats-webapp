<template>
  <div class="chat-sider" bg-text w-14 flex flex-col justify-between items-center text-5>
    <div class="sider-top" pt-2>
      <k-avatar :src="avatar" :title="userName" :alt="userName" w-10 h-10 mb-5 />
      <div class="actions" c-second>
        <div v-for="(item, index) in navs" :key="index" class="btn" 
        :class="{ open: item.name == openNav }"
          @click="handleNav(item.name)">
          <div :class="item.normal" normal></div>
          <div :class="item.hover" hover></div>
        </div>
      </div>
    </div>
    <div class="sider-bottom" pb-3>
      <a href="javascript:;" title="退出" text-5 flex rd p-2 text-warning-500 hover:bg-primary-300 hover:c-white @click="handleLogout">
        <div i-bi:box-arrow-left></div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/stores/user'
import { useAppStore, PANELS } from '@/stores/app'
import { useRouter } from 'vue-router'

const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()

const avatar = computed(() => userStore.avatar)
const userName = computed(() => userStore.userName)

const navs = [
  {
    name: PANELS.CONVERSE,
    normal: 'i-bi:chat-dots-fill',
    hover: 'i-bi:chat-dots'
  },
  {
    name: PANELS.CONTACT,
    normal: 'i-bi:people-fill',
    hover: 'i-bi:people'
  }
]

const openNav = computed(() => appStore.activePanel)

const handleNav = (item) => {
  if (openNav !== item) {
    appStore.changeActivePanel(item)
  }
}

const handleLogout = () => {
  userStore
    .logout()
    .then(() => {
      router.push('/login')
    })
    .catch((err) => {
      console.error('logout', err)
    })
}
</script>

<style scoped lang="less">
.btn {
  @apply rd flex justify-center items-center p-2 cursor-pointer lh-none mb-2 c-white hover:bg-primary-300 ;
  div[normal] {
    display: block;
  }

  div[hover] {
    display: none;
  }

  &.open {
    @apply bg-primary-300;

    div[normal] {
      display: none;
    }

    div[hover] {
      display: block;
    }
  }
}
</style>
