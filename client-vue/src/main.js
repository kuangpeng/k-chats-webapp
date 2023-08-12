import 'uno.css'
import '@unocss/reset/normalize.css'
import './styles/main.less'

import { createApp } from 'vue'
import store from './stores'

import App from './App.vue'
import router from './router'
import './authRouter'
import KLoading from './components/common/KLoading/KLoading'

localStorage.debug = 'app:*'

const app = createApp(App)

app.use(store)
app.use(router)

app.directive('loading', KLoading)

app.mount('#app')
