import axios from 'axios'
import router from '@/router'
import { useUserStore } from '../stores/user'

const baseURL = import.meta.env.VITE_API_BASE_URL

const axiosInstance = axios.create({
  baseURL: baseURL + '/api/v1'
  // proxy: {
  //   protocol: 'http',
  //   host: '127.0.0.1',
  //   port: 3090
  // }
})

axiosInstance.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()

    if (userStore.token) {
      config.headers['token'] = userStore.token
    }

    if (config.formData) {
      config.headers['Content-Type'] = 'multipart/form-data'
    } else if (config.formEncode) {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    } else {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

axiosInstance.interceptors.response.use(
  function (response) {
    if (response.status.toString().startsWith('2')) {
      return Promise.resolve(response.data)
    } else {
      return Promise.reject(response.data)
    }
  },
  function (error) {
    if (error.response && error.response.status == 401) {
      const userStore = useUserStore()

      userStore.reset()

      router.push('/login')
    } else {
      return Promise.reject(error)
    }
  }
)

export default axiosInstance
