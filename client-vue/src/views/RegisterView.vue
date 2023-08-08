<script setup>
import { useRouter } from 'vue-router'
import { APP_CONFIG } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import { upload } from '@/api/file'

const router = useRouter()
const userStore = useUserStore()

const userModel = reactive({
  name: '',
  password: '',
  avatar: ''
})

const uploadField = ref(null)
const avatarUrl = ref(APP_CONFIG.avatar_default)

const handlerUpload = () => {
  // uploadField.value.trigger('click')
  const formData = new FormData()

  formData.append('avatar', uploadField.value.files[0])

  upload(formData).then(res => {
    console.log(res)
    avatarUrl.value = res.data.url
    userModel.avatar = res.data.avatar
  }).catch(err => {
    console.log(err)
  })
}

const handleLogin = () => {
  const user = {
    userName: userModel.name,
    password: userModel.password,
    avatar: userModel.avatar
  }
  userStore
    .register(user)
    .then(() => {
      userStore.login({
        userName: userModel.name,
        password: userModel.password
      }).then(() => {
        router.push('/')
      })
    })
    .catch(() => { })
  // router.push('/')
}
</script>

<template>
  <div class="register" w-screen h-screen flex justify-center items-center>
    <div class="register-form" w-100 rd bg-white>
      <form py-3 px-5 flex flex-col justify-between items-center enctype="multipart/form-data">
        <h3 text-center text-md mb-5>注 册</h3>
        <div relative flex mb-5 w-20 h-20 rounded-full overflow-hidden cursor-pointer ring ring-offset-2 ring-offset-gray-300>
          <div class="bg-gray-500/50" absolute bottom-0 left-0 right-0 pb-1 z-2 text-xs text-center c-white>上传头像</div>
          <k-avatar :src="avatarUrl" w-20 h-20 z-1 />
          <input type="file" name="avatar" accept="image/*" ref="uploadField" absolute top--5 bottom--5 left--5 right--5 z-3 text-0 cursor-pointer @change="handlerUpload"/>
        </div>

        <input type="text" class="k-input" mb-4 v-model="userModel.name" placeholder="用户名" />
        <input type="password" class="k-input" mb-4 v-model="userModel.password" placeholder="密码" autocomplete="false" />
        <k-button block @click="handleLogin">注 册</k-button>
        <router-link to="/login" text-3 text-primary-300 underline mt-3>>登 录</router-link>
      </form>
    </div>
  </div>
</template>
