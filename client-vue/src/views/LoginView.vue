<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from './../stores/user'

const router = useRouter()
const userStore = useUserStore()

const userModel = reactive({
  name: '',
  password: ''
})

const loading = ref(false)

const handleLogin = () => {
  loading.value = true
  const user = {
    userName: userModel.name,
    password: userModel.password
  }
  if (!user.userName || !user.password) {
    //TODO: notify
    alert('请填写用户名或密码')
    return false
  }

  userStore
    .login(user)
    .then(() => {
      router.push('/')
    })
    .catch(() => { })
    .finally(() => {
      loading.value = false
    })
}
</script>

<template>
  <div class="login" screen-full flex justify-center items-center>
    <div class="login-form" w-95 rd-3 overflow-hidden border="1 solid gray-200" bg-white v-loading="loading" element-loading-text="登录中...">
      <form h-70 py-sm px-5 flex flex-col flex-justify-between flex-items-center @keydown.enter="handleLogin">
        <h3 text-center text-lg>Let`s Chat!</h3>
        <input type="text" class="k-input" v-model="userModel.name" placeholder="用户名" />
        <input type="password" class="k-input" v-model="userModel.password" placeholder="密码" autocomplete="false" />
        <k-button type="primary" :loading="loading" @click="handleLogin" block>登 录</k-button>
        <router-link to="/register" text-3 c-info-300 underline>>注 册</router-link>
      </form>
    </div>
  </div>
</template>
