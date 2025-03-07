import Vue from 'vue'
import { successCode } from '~/utils/constants'

export const state = () => ({
  isCallApi: false,
  questionBank: [],
  listQuestionOfBank: null,
  question: null,
})

export const actions = {
  async fetchQuestionBank({ commit }) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } =
        await this.$repositories.question.fetchQuestionBank()

      if (+status === successCode.OK && data) {
        commit('SET_QUESTION_BANK', data)
      }
    } catch (error) {
      commit('SET_QUESTION_BANK', [])
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async addQuestionToBank({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } =
        await this.$repositories.question.addQuestionToBank(payload)
      if (+status === successCode.OK && data) {
        Vue.prototype.$bus.$emit('add-questions-to-bank-done')
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async showQuestionBank({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } =
        await this.$repositories.question.showQuestionBank(payload)

      if (+status === successCode.OK && data) {
        commit('SET_LIST_QUESTION_OF_BANK', data)
      }
    } catch (error) {
      commit('SET_LIST_QUESTION_OF_BANK', [])
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async createTopic({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.question.createTopic(
        payload
      )
      if (+status === successCode.CREATED && data) {
        Vue.prototype.$bus.$emit('create-topic-done')
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async updateTopic({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.question.updateTopic(
        payload
      )
      if (+status === successCode.OK && data) {
        Vue.prototype.$bus.$emit('update-topic-done')
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async deleteTopic({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.question.deleteTopic(
        payload
      )
      if (+status === successCode.OK && data) {
        Vue.prototype.$bus.$emit('delete-topic-done')
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async showQuestion({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.question.showQuestion(
        payload
      )
      if (+status === successCode.OK && data) {
        commit('SET_QUESTION', data)
      }
    } catch (error) {
      commit('SET_QUESTION', [])
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async updateQuestion({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.question.updateQuestion(
        payload
      )
      if (+status === successCode.OK && data) {
        Vue.prototype.$bus.$emit('update-question-done')
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async deleteQuestion({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.question.deleteQuestion(
        payload
      )
      if (+status === successCode.OK && data) {
        Vue.prototype.$bus.$emit('delete-question-done')
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },
}

export const mutations = {
  SET_IS_CALL_API(state, isCallApi) {
    state.isCallApi = isCallApi
  },
  SET_QUESTION_BANK(state, questionBank) {
    state.questionBank = questionBank
  },
  SET_LIST_QUESTION_OF_BANK(state, listQuestionOfBank) {
    state.listQuestionOfBank = listQuestionOfBank
  },
  SET_QUESTION(state, question) {
    state.question = question
  },
}
