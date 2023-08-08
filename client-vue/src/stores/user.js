import { defineStore } from 'pinia'
import { useAppStore } from './app'
import { login as loginApi, register as registerApi } from '@/api/auth'

export const useUserStore = defineStore(
  'user',
  () => {
    const uid = ref('')
    const userName = ref('')
    const token = ref('')
    const avatar = ref('')

    function reset() {
      uid.value = ''
      userName.value = ''
      token.value = ''
      avatar.value = ''
    }

    function login(user) {
      this.userName = user.userName

      return new Promise((resolve, reject) => {
        loginApi({
          userName: user.userName,
          password: user.password
        })
          .then((res) => {
            uid.value = res.data._id
            userName.value = user.userName
            token.value = res.token
            avatar.value = res.data.avatar

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }

    function register(newUser) {
      return new Promise((resolve, reject) => {
        registerApi({
          userName: newUser.userName,
          password: newUser.password,
          avatar: newUser.avatar
        })
          .then((res) => {
            // userName.value = newUser.userName
            // token.value = res.token

            resolve(res)
          })
          .catch((err) => {
            reject(err)
          })
      })
    }

    function logout() {
      return new Promise((resolve) => {
        const appStore = useAppStore()

        appStore.resetApp()

        resolve()
      })
    }

    return {
      uid,
      userName,
      token,
      avatar,
      reset,
      login,
      register,
      logout
    }
  },
  {
    persist: {
      key: 'chat-user'
    }
  }
)
