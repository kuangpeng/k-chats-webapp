<template>
  <div :class="classList" v-bind="$attrs">
    <img :src="src" :alt="alt" :title="title" />
  </div>
</template>

<script setup>
defineOptions({
  name: 'k-avatar'
})

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  title: String,
  alt: String,
  shape: {
    type: String,
    validator(val) {
      return ['circle', 'square'].includes(val)
    },
    default: 'square'
  }
})

const classList = computed(() => {
  const classAttr = ['k-avatar']

  classAttr.push(`k-avatar--${props.shape}`)

  return classAttr
})
</script>
