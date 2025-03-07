import { successCode } from '~/utils/constants'

export const state = () => ({
  isCallApi: false,
  user: null,
})

export const getters = {
  user: (state) => {
    return state.user
  },
}

export const actions = {
  async fetchUser({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      const { status, data } = await this.$repositories.user.fetchUser(payload)

      if (+status === successCode.OK && data) {
        console.log(data)
        commit('SET_USER', data)
        commit('SET_USER_STATUS', 'success')
      }
    } catch (error) {
      const { status } = error.response
      console.log(status)
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },
}

export const mutations = {
  SET_IS_CALL_API(state, isCallApi) {
    state.isCallApi = isCallApi
  },
  SET_USER(state, user) {
    state.user = user
  },
}
