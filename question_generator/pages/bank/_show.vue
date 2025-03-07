<template>
  <div class="">
    <div class="topic" v-if="listQuestionOfBank">
      <center>
        <h1 class="title">
          Topic: {{ listQuestionOfBank.data.attributes.topic }}
        </h1>
      </center>

      <div
        v-for="(question, questionKey) in listQuestionOfBank.data.attributes
          .questions"
        :key="questionKey"
      >
        <b-form-checkbox-group name="flavour-1a">
          <div class="wrapper-content-qa-show">
            <div class="content-qa-show">
              <b-form-checkbox :value="questionKey">
                <h6 class="question-show">
                  Question {{ questionKey + 1 }}.
                  {{ question.data.attributes.question }}
                </h6>
                <p>Answer: {{ question.data.attributes.answer }}</p>
                <p v-if="question.data.attributes.distractor1">
                  Distractor 1: {{ question.data.attributes.distractor1 }}
                </p>
                <p v-if="question.data.attributes.distractor2">
                  Distractor 2: {{ question.data.attributes.distractor2 }}
                </p>
                <p v-if="question.data.attributes.distractor3">
                  Distractor 3: {{ question.data.attributes.distractor3 }}
                </p>
              </b-form-checkbox>
            </div>
            <div class="popup-wrapper">
              <popup-wrapper>
                <template #header>
                  <div class="icon-popup">
                    <b-img :src="ICON.threeDot" />
                  </div>
                </template>
                <template #content>
                  <svg
                    height="12"
                    viewBox="0 0 25 12"
                    width="25"
                    class="x10l6tqk xng853d xu8u0ou"
                    fill="#fff"
                    style="transform: scale(-1) translate(0px, 0px)"
                  >
                    <path
                      d="M24.553.103c-2.791.32-5.922 1.53-7.78 3.455l-9.62 7.023c-2.45 2.54-5.78 1.645-5.78-2.487V2.085C1.373 1.191.846.422.1.102h24.453z"
                    ></path>
                  </svg>

                  <div class="content-popup">
                    <ul>
                      <li
                        @click="
                          btnShowModalUpdateQuestion(question.data.question_id)
                        "
                      >
                        <div class="content-item">
                          <div class="icon">
                            <b-img :src="IMAGE.edit"></b-img>
                          </div>
                          <div class="title">Edit</div>
                        </div>
                      </li>
                      <li @click="btnDeleteQuestion(question.data.question_id)">
                        <div class="content-item item-delete">
                          <div class="icon">
                            <b-img :src="IMAGE.delete"></b-img>
                          </div>
                          <div class="title">Delete</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </template>
              </popup-wrapper>
            </div>
          </div>
        </b-form-checkbox-group>
      </div>
    </div>
    <update-question-modal
      v-if="showUpdateQuestionModal"
      :id_question="idQuestionChoosen"
      @close-modal="showUpdateQuestionModal = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UpdateQuestionModal from '~/components/question/UpdateQuestionModal'

import { ICON, IMAGE } from '~/utils/constants'

export default {
  name: 'Profile',
  components: { UpdateQuestionModal },
  layout: 'default_home',
  middleware: 'auth/auth',
  data() {
    return {
      ICON,
      IMAGE,
      showUpdateQuestionModal: false,
      idQuestionChoosen: 0,
    }
  },
  async fetch() {
    if (this.isLogin === true) {
      await this.$store.dispatch(
        'question/question/showQuestionBank',
        Number(this.$route.params.show)
      )
    }
  },
  computed: {
    ...mapState({
      isLogin: (state) => state.user.auth.isLogin,
      listQuestionOfBank: (state) => state.question.question.listQuestionOfBank,
    }),
  },

  mounted() {
    const self = this
    this.$nextTick(() => {
      self.$bus.$on('update-question-done', () => {
        this.showUpdateQuestionModal = false
        this.$store.dispatch(
          'question/question/showQuestionBank',
          Number(this.$route.params.show)
        )
      })

      self.$bus.$on('delete-question-done', () => {
        this.$store.dispatch(
          'question/question/showQuestionBank',
          Number(this.$route.params.show)
        )
      })
    })
  },

  methods: {
    async btnDeleteQuestion(id) {
      await this.$store.dispatch('question/question/deleteQuestion', Number(id))
    },

    btnShowModalUpdateQuestion(questionId) {
      this.idQuestionChoosen = questionId
      this.showUpdateQuestionModal = true
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/popup/popup';
@import 'assets/scss/bank/show';
@import 'assets/scss/animation';

.loading-post {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.loading-wrapper {
  span {
    position: absolute;
    display: block;
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: speed 2s infinite ease-in-out;

    &.one {
      background: #4285f4;
      animation-delay: 1.5s;
    }

    &.two {
      background: #ea4335;
      animation-delay: 1s;
    }

    &.three {
      background: #fbbc05;
      animation-delay: 0.5s;
    }

    &.four {
      background: #34a853;
    }
  }
}
</style>
