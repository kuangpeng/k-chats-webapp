<template>
  <button type="button" :class="classParam">
    <span><slot /></span>
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'default',
    validator: function (value) {
      return ['default', 'primary', 'info', 'success', 'warning', 'danger', 'text'].includes(value)
    }
  },
  size: {
    type: String,
    default: 'default',
    validator: function (value) {
      return ['default', 'large', 'small'].includes(value)
    }
  },
  round: {
    type: Boolean,
    default: false
  },
  circle: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingIcon: {
    type: String,
    default: 'loading'
  }
})

const classParam = computed(() => {
  let classObj = ['c-button']

  if (props.type !== 'default') classObj.push('c-button--' + props.type)

  if (props.size !== 'default') classObj.push('c-button--' + props.size)

  if (props.round) {
    classObj.push('is-round')
  } else if (props.circle) {
    classObj.push('is-circle')
  }

  return classObj
})
</script>
