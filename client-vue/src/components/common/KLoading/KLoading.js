import KLoading from './KLoading.vue'

const kLoading = {
  mounted(el, binding) {
    if (binding.value) {
      const loadingText = el.getAttribute('element-loading-text')
      const wrapper = document.createElement('div')

      el.classList.add('k-loading--parent')
      wrapper.classList.add('k-loading-wrapper')

      const opt = {}
      if (loadingText) {
        opt.text = loadingText
      }
      createApp(KLoading, opt).mount(wrapper)

      el.appendChild(wrapper)
    }
  },
  updated(el, binding) {
    if (binding.value === binding.oldValue) {
      return false
    }

    if (binding.value) {
      const loadingText = el.getAttribute('element-loading-text')
      const wrapper = document.createElement('div')

      el.classList.add('k-loading--parent')
      wrapper.classList.add('k-loading-wrapper')

      const opt = {}
      if (loadingText) {
        opt.text = loadingText
      }
      createApp(KLoading, opt).mount(wrapper)

      el.appendChild(wrapper)
    } else {
      const wrapper = el.querySelector('.k-loading-wrapper')
      wrapper && el.removeChild(wrapper)
      el.classList.remove('k-loading--parent')
    }
  }
}

export default kLoading
