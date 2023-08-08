<template>
  <div flex justify-center transition-top ease-in-out duration-300 bg-white>
    <div flex flex-col relative w-40 b-r b-gray-4 b-r-solid pb-12 min-h-0>
      <h3 px-4 py-2 text-4 font-bold>已选成员</h3>
      <div flex-1 overflow-y-auto>
        <div px-4>
          <div v-for="chat in selectedList" :key="chat._id" flex gap-x-1 items-center text-4 py-2>
            <k-avatar w-6 h-6 shape="circle" :src="chat.avatar" :alt="chat.remark" />
            <div>{{ chat.remark }}</div>
          </div>
        </div>
      </div>
      <div absolute left-0 right-0 bottom-0 flex justify-center p-2>
        <k-button icon="i-bi:check" :loading="launchLoading" block @click="handleCompleteChoose">完 成</k-button>
      </div>
    </div>
    <div flex grow-1 pb-12 relative>
      <div p-3 flex-1 overflow-y-auto>
        <div v-if="isRest" grid grid-cols-3 gap-1>
          <chat-contact-item
            flex-grow-1
            v-for="item in contactsList"
            :key="item._id"
            v-bind="{ mode: 'select', ...item }"
            @choose="handleChoose"
          />
        </div>
      </div>
      <div w-full text-center absolute left-0 bottom-0 pb-2>
        <k-button icon="i-bi:arrow-left" @click="handleBack">返 回</k-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useContactsStore } from '@/stores/contacts'
import converse from '@/modules/converse'

const contactsStore = useContactsStore()

const emit = defineEmits(['launchGroup', 'back'])

const contactsList = computed(() => contactsStore.contacts)

const selectedList = ref([])

const launchLoading = ref(false)

const isRest = ref(false)

onBeforeMount(() => {
  isRest.value = true
})

const handleChoose = (id) => {
  let i = selectedList.value.findIndex((sl) => sl.contactId === id)
  if (i > -1) {
    selectedList.value.splice(i, 1)
  } else {
    let c = contactsList.value.find((cl) => cl.contactId === id)

    selectedList.value.push(c)
  }
}

const resetStatus = () => {
  selectedList.value = []
  isRest.value = false
}

const handleCompleteChoose = () => {
  launchLoading.value = true

  let ids = selectedList.value.map((sl) => sl.contactId)
  
  converse.launchGroup(ids).then(() => {
    launchLoading.value = false
    
    emit('close')

    resetStatus()
  })
  
}

const handleBack = () => {
  emit('back')

  resetStatus()
}
</script>

<style scoped>
.show {
  top: 0;
}
</style>
