import Vue from 'vue'
import { successCode } from '~/utils/constants'

export const state = () => ({
  isCallApi: false,
  questions: null,
  listAnswerGen: null,
  listQAGen: null,
})

export const getters = {
  posts: (state) => {
    return state.posts
  },
}

export const actions = {
  async generatorKeywords({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } =
        await this.$repositories.generator.generatorKeywords(payload)

      if (+status === successCode.OK && data) {
        console.log(data.listAnswer)
        commit('SET_LIST_ANSWER_GEN', data)
      }
    } catch (error) {
      commit('SET_LIST_ANSWER_GEN', [])
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async generatorQuestions({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } =
        await this.$repositories.generator.generatorQuestions(payload)

      if (+status === successCode.OK && data) {
        commit('SET_LIST_QA_GEN', data)
        Vue.prototype.$bus.$emit('gen-list-qa-done')
      }
    } catch (error) {
      commit('SET_LIST_QA_GEN', [])
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },
}

export const mutations = {
  SET_IS_CALL_API(state, isCallApi) {
    state.isCallApi = isCallApi
  },
  SET_QUESTIONS(state, questions) {
    state.questions = questions
  },
  SET_LIST_ANSWER_GEN(state, listAnswerGen) {
    state.listAnswerGen = listAnswerGen
  },
  SET_LIST_QA_GEN(state, listQAGen) {
    state.listQAGen = listQAGen
  },

  ADD_ANSWER_TO_LIST_ANSWER(state, answer) {
    state.listAnswerGen.listAnswer.push(answer)
  },
}
