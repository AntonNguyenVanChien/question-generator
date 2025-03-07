<template>
  <div>
    <transition name="modal-custom-fade">
      <div class="modal-custom-overlay" @click="$emit('close-modal')">
        <div class="modal-custom" @click.stop>
          <div class="top">
            <div class="title-top">
              <span>Add new Topic</span>
            </div>
            <div class="close-post-show-modal" @click="$emit('close-modal')">
              <b-img :src="ICON.close"></b-img>
            </div>
          </div>
          <div class="content">
            <div class="mb-3">
              <label for="topicTitle" class="form-label">Topic Title</label>
              <input
                v-model="topicName"
                type="text"
                class="form-control"
                placeholder="Enter topic title"
              />
            </div>

            <center>
              <button
                :disabled="topicName.length === 0"
                class="btn btn-primary"
                @click="btnCreateTopic" 
                style="background-color: #e74646; border-color: #e74646;"
              >
                Create Topic
              </button>
            </center>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ICON, IMAGE } from '~/utils/constants'

export default {
  name: 'AddNewTopicModal',
  data: () => {
    return {
      ICON,
      IMAGE,
      topicName: '',
    }
  },
  methods: {
    async btnCreateTopic() {
      await this.$store.dispatch('question/question/createTopic', {
        topic: this.topicName,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/modal/choosenBankAddModal';
</style>
