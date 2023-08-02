<script setup>
import { useRouter } from 'vue-router'
import { useUserStore } from './../stores/user'

const router = useRouter()
const userStore = useUserStore()

const userModel = reactive({
  name: '',
  password: ''
})

const handleLogin = () => {
  const user = {
    userName: userModel.name,
    password: userModel.password
  }
  userStore
    .login(user)
    .then(() => {
      router.push('/')
    })
    .catch(() => { })
  // router.push('/')
}
</script>

<template>
  <div class="login" w-screen h-screen flex flex-justify-center flex-items-center>
    <div class="login-form" w-80 rd>
      <form h-60 py-sm px-5 flex flex-col flex-justify-between flex-items-center>
        <h3 text-center text-md>Let`s Chat!</h3>
        <input type="text" v-model="userModel.name" placeholder="用户名" />
        <input type="password" v-model="userModel.password" placeholder="密码" autocomplete="false" />
        <button type="button" block h-9 rd bg-primary-700 hover="bg-primary-500" @click="handleLogin">
          登 录
        </button>
        <router-link to="/register" text-3 text-primary-300 underline>>注 册</router-link>
      </form>
    </div>
  </div>
</template>

<style lang="less">
.login {
  .login-form {
    background-color: var(--color-background);
    color: var(--color-text);

    input {
      display: block;
      width: 100%;
      border: 1px solid var(--color-border);
      border-radius: 0.25rem;
      padding: 0.35rem 0.5rem;

      &:focus {
        border-color: var(--c-color-primary-400);
      }
    }

    button {
      width: 100%;
    }
  }
}
</style>
