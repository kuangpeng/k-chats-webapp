import { defineStore } from 'pinia'
// import storage from './../utils/storage'
import { login, register } from './../api/auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    uid: '',
    userName: '',
    token: '',
    avatar: ''
  }),
  getters: {},
  actions: {
    login(user) {
      this.userName = user.userName

      return new Promise((resolve, reject) => {
        login({
          userName: user.userName,
          password: user.password
        })
          .then((res) => {
            this.uid = res.data._id
            this.userName = user.userName
            this.token = res.token
            this.avatar = res.data.avatar

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    register(newUser) {
      return new Promise((resolve, reject) => {
        register({
          userName: newUser.userName,
          password: newUser.password
        })
          .then((res) => {
            this.userName = newUser.userName
            this.token = res.token

            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    logout() {},
    reset() {
      // this.uid = ''
      // this.userName = ''
      // this.avatar = ''
      // this.token = ''
      this.$reset()
    }
  },
  persist: {
    key: 'chat-user'
  }
})
