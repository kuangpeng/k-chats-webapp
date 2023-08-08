<template>
  <button type="button" :disabled="disabled || loading" :class="classParam" >
    <i v-if="loading || icon" class="k-icon" :class="{'is-loading': loading}">
      <div :class="iconShow"></div>
    </i>
    <span v-if="isHasContent"><slot /></span>
  </button>
</template>

<script setup>
defineOptions({
  name: 'k-button'
})

const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: function (value) {
      return ['default', 'primary', 'info', 'success', 'warning', 'danger', 'text'].includes(value)
    }
  },
  disabled: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  text: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'default',
    validator: function (value) {
      return ['default', 'sm', 'lg'].includes(value)
    }
  },
  block: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingIcon: {
    type: String,
    default: 'i-svg-spinners:3-dots-rotate'
  }
})

const slots = useSlots()

const isHasContent = computed(() => {
  return slots.default
})

const classParam = computed(() => {
  let classObj = ['k-btn']

  if (props.type !== 'default') classObj.push('k-btn-' + props.type)

  if (props.circle) {
    classObj.push('is-rounded')
  }

  if (props.text) {
    classObj.push('is-text')
  }

  if (props.block) {
    classObj.push('is-block')
  }

  if (props.size) {
    classObj.push(`k-btn-${props.size}`)
  }
  
  return classObj
})

const iconShow = computed(() => {
  if (props.loading) {
    return props.loadingIcon
  } else {
    return props.icon
  }
})

</script>
