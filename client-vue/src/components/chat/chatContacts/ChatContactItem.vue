<template>
  <div class="contact-item"
    :class="{ 'cursor-pointer': mode === 'select', 'bg-primary-300': mode === 'select' && isChoose }" flex justify-between
    items-center px-2 py-2 border-1 border-solid border-transparent rd hover:border-primary-100 @click="handleClick">
    <div flex items-center gap-x-2>
      <k-avatar :src="avatar" :alt="name" :title="name" w-8 h-8 />
      <div class="min-w-0 flex-auto">
        <p class="line-clamp-1 text-sm font-semibold leading-6 text-gray-900">{{ name }}</p>
      </div>
    </div>
    <div v-if="mode === 'chat'" class="sm:flex sm:flex-col sm:items-end cursor-pointer hover:c-primary" @click="handleStartTalk">
      <div class="i-bi:chat-dots" text-5></div>
    </div>
    <div v-else-if="mode === 'add'" class="sm:flex sm:flex-col sm:items-end cursor-pointer hover:c-primary" @click="handleAddContact">
      <div class="i-bi:plus-square-fill" text-5></div>
    </div>
  </div>
</template>

<script setup>
import contactModule from '@/modules/contact'
import converseModule from '@/modules/converse'

const props = defineProps({
  chatType: {
    type: String,
    validator: (value) => {
      return ['person', 'group'].includes(value)
    }
  },
  contactId: String,
  _id: String,
  id: String,
  groupId: String,
  remark: String,
  avatar: String,
  name: String,
  mode: {
    type: String,
    validate: {
      validator(v) {
        /**
         * chat: 发起聊天
         * add: 添加好友
         * select: 选择入群聊
         */
        return ['chat', 'add', 'select'].includes(v)
      }
    }
  }
})

const emit = defineEmits(['choose'])

const id = computed(() => {
  if (props.mode === 'chat' || props.mode === 'select') {
    return props.chatType === 'person' ? props.contactId : props.groupId
  } else if (props.mode === 'add') {
    return props.id
  } else {
    return ''
  }
})

const name = computed(() => {
  if (props.mode === 'chat' || props.mode === 'select') {
    return props.remark
  } else if (props.mode === 'add') {
    return props.name
  } else {
    return ''
  }
})

// TODO:
const handleStartTalk = () => {
  converseModule.startTalk({
    id: id.value,
    chatType: props.chatType
  })
}

const handleAddContact = () => {
  // contactsStore.addContact(id.value)
  contactModule.emitAddContact(id.value)
}

const isChoose = ref(false)
const handleClick = () => {
  isChoose.value = !isChoose.value
  emit('choose', id.value)
}
</script>
<style lang=""></style>
