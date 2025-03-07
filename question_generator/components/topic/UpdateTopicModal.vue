<template>
  <div>
    <transition name="modal-custom-fade">
      <div class="modal-custom-overlay" @click="$emit('close-modal')">
        <div class="modal-custom" @click.stop>
          <div class="top">
            <div class="title-top">
              <span>Update Topic</span>
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
                :disabled="topicName.length <= 0"
                class="btn btn-primary"
                @click="btnUpdateTopic"
                style="background-color: #e74646; border-color: #e74646;"
              >
                Update Topic
              </button>
            </center>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import { ICON, IMAGE } from '~/utils/constants'

export default {
  name: 'UpdateTopicModal',
  props: {
    id_bank: Number,
  },
  data: () => {
    return {
      ICON,
      IMAGE,
      topicName: '',
    }
  },
  async fetch() {
    await this.$store.dispatch(
      'question/question/showQuestionBank',
      this.id_bank
    )
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.user.auth.isLogin,
      listQuestionOfBank: (state) => state.question.question.listQuestionOfBank,
    }),
  },
  watch: {
    listQuestionOfBank() {
      this.topicName = this.listQuestionOfBank.data.attributes.topic
    },
  },
  methods: {
    async btnUpdateTopic() {
      await this.$store.dispatch('question/question/updateTopic', {
        topic: this.topicName,
        id: Number(this.id_bank),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/modal/choosenBankAddModal';
</style>
