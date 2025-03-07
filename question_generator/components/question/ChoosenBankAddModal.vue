<template>
  <div>
    <transition name="modal-custom-fade">
      <div class="modal-custom-overlay" @click="$emit('close-modal')">
        <div class="modal-custom" @click.stop>
          <div class="top">
            <div class="title-top">
              <span>Choosen Question Bank Add</span>
            </div>
            <div class="close-post-show-modal" @click="$emit('close-modal')">
              <b-img :src="ICON.close"></b-img>
            </div>
          </div>
          <div class="content">
            <center>
              <p class="title">
                Add <strong>{{ list_question_add.length }}</strong> question to
                Bank:
              </p>
            </center>
            <div
              v-for="(questionBank, questionBankKey) in questionBank.data"
              :key="questionBankKey"
            >
              <b-form-checkbox-group v-model="selectedBank" name="flavour-1a">
                <b-form-checkbox :value="questionBank.data.question_bank_id">
                  <h6>
                    {{ questionBankKey + 1 }}.
                    {{ questionBank.data.attributes.topic }}
                  </h6>
                </b-form-checkbox>
              </b-form-checkbox-group>
            </div>
            <button class="check-all-btn" @click="checkedAllBank">
              Choosen All
            </button>

            <center>
              <button
                class="add-to-bank-btn"
                :disabled="selectedBank.length === 0"
                @click="btnAddQuestionToBank"
              >
                Add Question to Bank
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
  name: 'ChoosenBankAddModal',
  props: {
    list_question_add: Array,
  },
  data: () => {
    return {
      ICON,
      IMAGE,
      selectedBank: [],
    }
  },
  async fetch() {
    await this.$store.dispatch('question/question/fetchQuestionBank')
  },
  computed: {
    ...mapState({
      questionBank: (state) => state.question.question.questionBank,
    }),
  },
  methods: {
    checkedAllBank(value) {
      this.selectedBank = value
        ? this.questionBank.data.map((bank) => bank.data.question_bank_id)
        : []
    },

    async btnAddQuestionToBank() {
      await this.$store.dispatch('question/question/addQuestionToBank', {
        listQuestion: this.list_question_add,
        listBank: this.selectedBank.map((value) => Number(value)),
      })
      this.$router.go(0)
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/modal/choosenBankAddModal';
</style>
