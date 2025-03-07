<template>
  <div ref="customDiv">
    <div @click="toggle">
      <slot name="header" />
    </div>

    <div v-if="showPopup" @click.stop>
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PopupWrapper',
  data() {
    return {
      showPopup: false,
      customDiv: null,
    }
  },
  mounted() {
    this.customDiv = this.$refs.customDiv
    document.addEventListener('click', this.handleClickOutside)

    const self = this
    this.$nextTick(() => {
      self.$bus.$on('update-topic-done', () => {
        this.showPopup = false
      })
      self.$bus.$on('delete-topic-done', () => {
        this.showPopup = false
      })
      self.$bus.$on('update-question-done', () => {
        this.showPopup = false
      })
      self.$bus.$on('delete-question-done', () => {
        this.showPopup = false
      })
      self.$bus.$on('logout-done', () => {
        this.showPopup = false
      })
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggle() {
      this.showPopup = !this.showPopup
    },
    handleClickOutside(event) {
      if (this.customDiv && !this.customDiv.contains(event.target)) {
        this.showPopup = false
      }
    },
    hidePopup() {
      this.showPopup = false
    },
  },
}
</script>
