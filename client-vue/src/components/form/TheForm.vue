<template>
  <form ref="form" @submit="handleSubmit">
    <slot />
    <slot name="button" />
  </form>
</template>

<script setup>
defineProps({
  model: {},
  rules: {},
  label: {
    type: String,
    default: 'none',
    validator(value) {
      return ['none', 'left', 'top'].includes(value)
    }
  }
})

const emit = defineEmits(['submit'])

const handleSubmit = (e) => {
  e.preventDefault()

  emit('submit')
}
</script>
