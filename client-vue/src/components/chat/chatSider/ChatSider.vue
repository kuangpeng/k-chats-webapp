<template>
  <div class="chat-sider" bg-light-9 w-12 flex flex-col justify-between items-center text-5>
    <div class="sider-top">
      <div class="avatar" pt-2 mb-5>
        <img :src="avatar" :alt="userName" :title="userName" w-10 h-10 rd b-1 b-solid b-gray-5 />
        <div>{{ userName }}</div>
      </div>
      <div class="actions" text-primary-500 mx-1>
        <div v-for="(item, index) in navs" :key="index" class="btn" :class="{ open: item.name == openNav }" rd flex
          justify-center items-center p-2 cursor-pointer mb-2 hover:bg-primary-100 @click="handleNav(item.name)">
          <div :class="item.normal" normal></div>
          <div :class="item.hover" hover></div>
        </div>
      </div>
    </div>
    <div class="sider-bottom" pb-3>
      <a href="javascript:;" text-5 flex rd p-2 text-danger-500 hover:bg-primary-300 @click="handleLogout">
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
  div[normal] {
    display: block;
  }

  div[hover] {
    display: none;
  }

  &.open {
    background-color: var(--c-color-primary-100);

    div[normal] {
      display: none;
    }

    div[hover] {
      display: block;
    }
  }
}
</style>
