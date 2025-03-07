<template>
  <div class="home">
    <div class="header">
      <div v-if="userProfile && isLogin" class="profile">
        <div class="popup-wrapper">
          <popup-wrapper>
            <template #header>
              <!-- <div class="icon-popup">
                <b-img :src="ICON.threeDot" />
              </div> -->
              <div class="profile-logined">
                <h6>{{ userProfile.data.attributes.name }}</h6>
              </div>
            </template>
            <template #content>
              <div class="content-popup">
                <ul>
                  <li>
                    <span class="name-header">{{
                      userProfile.data.attributes.name
                    }}</span>
                  </li>
                  <li>
                    <span class="email-header">{{
                      userProfile.data.attributes.email
                    }}</span>
                  </li>
                  <li><hr /></li>
                  <li @click="btnLogout">
                    <div class="content-item item-delete">
                      <div class="icon">
                        <b-img :src="IMAGE.logOutHeader"></b-img>
                      </div>
                      <div class="title">Log out</div>
                    </div>
                  </li>
                </ul>
              </div>
            </template>
          </popup-wrapper>
        </div>
      </div>
      <h6 v-else class="login-header" @click="btnShowModalLogin">Login</h6>
    </div>
    <div class="content">
      <div class="sidebar-left col-2">
        <ul class="list-tag">
          <li @click="goToHomePage">Questions Generator</li>
        </ul>
        <h6 v-if="questionBank && isLogin" class="label">Question Bank</h6>
        <div v-if="questionBank && isLogin" class="list-topic">
          <ul>
            <li
              v-for="(questionBank, questionBankKey) in questionBank.data"
              :key="questionBankKey"
            >
              <p
                @click="
                  goToQuestionBankPage(questionBank.data.question_bank_id)
                "
              >
                o {{ questionBank.data.attributes.topic }} [{{
                  questionBank.data.attributes.questionCount
                }}]
              </p>
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
                      style="transform: scale(1, -1) translate(0px, 0px)"
                    >
                      <path
                        d="M24.553.103c-2.791.32-5.922 1.53-7.78 3.455l-9.62 7.023c-2.45 2.54-5.78 1.645-5.78-2.487V2.085C1.373 1.191.846.422.1.102h24.453z"
                      ></path>
                    </svg>

                    <div class="content-popup">
                      <ul>
                        <li
                          @click="
                            btnShowModalUpdateTopic(
                              questionBank.data.question_bank_id
                            )
                          "
                        >
                          <div class="content-item">
                            <div class="icon">
                              <b-img :src="IMAGE.edit"></b-img>
                            </div>
                            <div class="title">Edit</div>
                          </div>
                        </li>
                        <li
                          @click="
                            btnDeleteTopic(questionBank.data.question_bank_id)
                          "
                        >
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
            </li>
          </ul>
          <button class="add-new-topic" @click="btnShowModalAddNewTopic">
            Add Topic
          </button>
        </div>
      </div>
      <div class="center col-10">
        <div class="content-top">
          <h5 @click="goToHomePage">Questions Generator</h5>
        </div>
        <div>
          <nuxt class="page-content" />
        </div>
      </div>
    </div>

    <login-modal v-if="showLoginModal" @close-modal="showLoginModal = false" />

    <add-new-topic-modal
      v-if="showAddNewTopicModal"
      @close-modal="showAddNewTopicModal = false"
    />

    <update-topic-modal
      v-if="showUpdateTopicModal"
      :id_bank="idBankChoosen"
      @close-modal="showUpdateTopicModal = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import LoginModal from '~/components/sign-in/LoginModal'
import AddNewTopicModal from '~/components/topic/AddNewTopicModal'
import UpdateTopicModal from '~/components/topic/UpdateTopicModal'

import { IMAGE, ICON } from '~/utils/constants'

export default {
  name: 'LayoutDefaultHome',
  components: {
    LoginModal,
    AddNewTopicModal,
    UpdateTopicModal,
  },
  middleware: 'auth/auth',
  data() {
    return {
      ICON,
      IMAGE,
      showLoginModal: false,
      showAddNewTopicModal: false,
      showUpdateTopicModal: false,
      idBankChoosen: 0,
    }
  },
  async fetch() {
    if (this.isLogin === true) {
      await this.$store.dispatch('question/question/fetchQuestionBank')
      await this.$store.dispatch('user/auth/getUserProfile')
    }
  },
  computed: {
    ...mapState({
      questionBank: (state) => state.question.question.questionBank,
      userProfile: (state) => state.user.auth.userProfile,
      isLogin: (state) => state.user.auth.isLogin,
    }),
  },

  mounted() {
    const self = this
    this.$nextTick(() => {
      self.$bus.$on('create-topic-done', () => {
        this.showAddNewTopicModal = false
        this.$store.dispatch('question/question/fetchQuestionBank')
      })

      self.$bus.$on('update-topic-done', () => {
        this.showUpdateTopicModal = false
        this.$store.dispatch('question/question/fetchQuestionBank')
      })

      self.$bus.$on('delete-topic-done', () => {
        this.$store.dispatch('question/question/fetchQuestionBank')
      })

      self.$bus.$on('delete-question-done', () => {
        this.$store.dispatch('question/question/fetchQuestionBank')
      })

      self.$bus.$on('logout-done', () => {
        this.$store.dispatch('user/auth/checkLogin')
      })

      self.$bus.$on('login-done', () => {
        this.showLoginModal = false
        this.$store.dispatch('question/question/fetchQuestionBank')
        this.$store.dispatch('user/auth/getUserProfile')
      })
    })
  },

  methods: {
    btnShowModalLogin() {
      this.showLoginModal = true
    },
    goToQuestionBankPage(questionBankId) {
      this.$router.push(`/bank/${questionBankId}`)
    },
    goToHomePage() {
      this.$router.push('/')
    },
    btnShowModalAddNewTopic() {
      this.showAddNewTopicModal = true
    },
    btnShowModalUpdateTopic(questionBankId) {
      this.idBankChoosen = questionBankId
      this.showUpdateTopicModal = true
    },

    async btnDeleteTopic(id) {
      await this.$store.dispatch('question/question/deleteTopic', Number(id))
    },

    btnLogout() {
      console.log('Logout')
      this.$store.dispatch('user/auth/logoutAcc')
    },
  },
}
</script>

<style scoped lang="scss">
@import 'assets/scss/variables';
@import 'assets/scss/popup/popup';
@import 'assets/scss/main';
@import 'assets/scss/main/home';
@import 'assets/scss/animation';

// .default-layout {
//   background-color: #fff;
//   background-repeat: no-repeat;
//   background-size: cover;
//   display: flex;
//   flex-direction: column;
//   flex-wrap: nowrap;

//   .app-header {
//     background-color: #fff;
//     box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
//     border-bottom: 1px solid rgba(0, 0, 0, 0.2);
//   }

//   .layout-main {
//     display: flex;
//     flex: 1;
//     min-height: 100vh;
//     background-color: #ecf3ff;
//     margin-top: 60px;

//     .sidebar-left {
//       margin: 0;
//       padding: 0;
//       flex: 0 0 33.333333%;
//       max-width: 33.333333%;

//       @media screen and (max-width: 1249px) {
//         flex: 0 0 20%;
//         max-width: 20%;
//       }
//     }

//     .page-content {
//       flex: 0 0 33.333333%;
//       max-width: 33.333333%;

//       @media screen and (max-width: 1249px) {
//         flex: 0 0 60%;
//         max-width: 60%;
//       }
//     }

//     .sidebar-right {
//       margin: 0;
//       padding: 0;
//       flex: 0 0 33.333333%;
//       max-width: 33.333333%;

//       @media screen and (max-width: 1249px) {
//         flex: 0 0 20%;
//         max-width: 20%;
//       }
//     }
//   }
// }
</style>
