import router from './router'
// import storage from './utils/storage'
import { useUserStore } from './stores/user'

const whiteList = ['Login', 'Register']

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (userStore.token) {
    if (whiteList.indexOf(to.name) > -1) return next('/')
    else return next()
  } else {
    if (whiteList.indexOf(to.name) > -1) return next()
    else return next({ name: 'Login' })
  }
})
