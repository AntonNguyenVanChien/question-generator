<template>
  <div>
    <transition name="modal-custom-fade">
      <div class="modal-custom-overlay" @click="$emit('close-modal')">
        <div class="modal-custom" @click.stop>
          <div class="top">
            <div class="title-top">
              <span>Update Question</span>
            </div>
            <div class="close-post-show-modal" @click="$emit('close-modal')">
              <b-img :src="ICON.close"></b-img>
            </div>
          </div>
          <div class="content" style="height: 100%;overflow: scroll;">
            <div class="mb-3">
              <label for="question" class="form-label">Question:</label>
              <b-textarea
                v-model="questionText"
                class="content-input"
                :style="{ height: '200px' }"
              ></b-textarea>
            </div>

            <div class="mb-3">
              <label for="answer" class="form-label">Answer:</label>
              <input
                v-model="answerText"
                type="text"
                class="form-control"
                placeholder="Enter Aanswer Text"
              />
            </div>

            <div class="mb-3">
              <label for="distractor1" class="form-label">Distractor 1:</label>
              <input
                v-model="distractor1Text"
                type="text"
                class="form-control"
                placeholder="Enter Distractor 1"
              />
            </div>

            <div class="mb-3">
              <label for="distractor2" class="form-label">Distractor 2:</label>
              <input
                v-model="distractor2Text"
                type="text"
                class="form-control"
                placeholder="Enter Distractor 2"
              />
            </div>

            <div class="mb-3">
              <label for="distractor3" class="form-label">Distractor 3:</label>
              <input
                v-model="distractor3Text"
                type="text"
                class="form-control"
                placeholder="Enter Distractor 3"
              />
            </div>

            <center>
              <button
                class="btn btn-primary"
                :disabled="
                  questionText.trim() === '' ||
                  questionText === null ||
                  answerText.trim() === '' ||
                  answerText === null ||
                  distractor1Text.trim() === '' ||
                  answerText === null ||
                  distractor2Text.trim() === '' ||
                  answerText === null ||
                  distractor3Text.trim() === '' ||
                  answerText === null
                "
                @click="btnUpdateQuestion"
                style="background-color: #e74646; border-color: #e74646;"
              >
                Update Question
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
  name: 'UpdateQuestionModal',
  props: {
    id_question: Number,
  },
  data: () => {
    return {
      ICON,
      IMAGE,
      questionText: '',
      answerText: '',
      distractor1Text: '',
      distractor2Text: '',
      distractor3Text: '',
    }
  },
  async fetch() {
    await this.$store.dispatch(
      'question/question/showQuestion',
      this.id_question
    )
  },
  computed: {
    ...mapState({
      question: (state) => state.question.question.question,
    }),
  },
  watch: {
    question() {
      this.questionText = this.question.data.attributes.question
      this.answerText = this.question.data.attributes.answer
      this.distractor1Text = this.question.data.attributes.distractor1
      this.distractor2Text = this.question.data.attributes.distractor2
      this.distractor3Text = this.question.data.attributes.distractor3
    },
  },
  methods: {
    async btnUpdateQuestion() {
      await this.$store.dispatch('question/question/updateQuestion', {
        question: this.questionText,
        answer: this.answerText,
        distractor1: this.distractor1Text,
        distractor2: this.distractor2Text,
        distractor3: this.distractor3Text,
        id: Number(this.id_question),
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/modal/choosenBankAddModal';
</style>
