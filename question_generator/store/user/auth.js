import Vue from 'vue'
import { successCode } from '~/utils/constants'

import storage from '~/utils/helpers/storage'

export const state = () => ({
  isCallApi: false,
  authenticated: false,
  userProfile: null,
  userInfo: {},
  isLogin: false,
})

export const actions = {
  async login({ commit }, payload) {
    commit('SET_IS_CALL_API', true)

    try {
      console.log(payload)
      const { status, data } = await this.$repositories.auth.login(payload)

      if (+status === successCode.OK && data) {
        commit('SET_IS_LOGIN', true)
        Vue.prototype.$bus.$emit('login-done')
        storage.saveAuth(data.token)
        commit('SET_IS_AUTHENTICATED', true)
      }
    } catch (error) {
      console.log(error.response)
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async register({ commit }, payload) {
    commit('SET_IS_CALL_API', true)
    const startTime = performance.now()
    setTimeout(() => {
      Vue.prototype.$bus.$emit('toggle-loading')
    }, 10)

    try {
      const { status, data } = await this.$repositories.auth.register(payload)

      console.log(status)
      console.log(data)

      // if (+status === successCode.OK && data) {

      // }
    } catch (error) {
      console.log(error)
    } finally {
      commit('SET_IS_CALL_API', false)
      const executeTime = performance.now() - startTime

      if (executeTime < 1000) {
        setTimeout(() => {
          Vue.prototype.$bus.$emit('toggle-loading')
        }, 1000 - executeTime)
      } else {
        Vue.prototype.$bus.$emit('toggle-loading')
      }
    }
  },

  async logoutAcc({ commit }) {
    // commit('SET_IS_CALL_API', true)
    // const startTime = performance.now()
    // setTimeout(() => {
    //   Vue.prototype.$bus.$emit('toggle-loading')
    // }, 10)
    try {
      const { status } = await this.$repositories.auth.logoutAcc()
      if (+status === successCode.OK) {
        if (storage.getAuth()) storage.deleteAuth()
        commit('SET_IS_AUTHENTICATED', false)
        Vue.prototype.$bus.$emit('logout-done')
      }
    } catch (error) {
      if (storage.getAuth()) storage.deleteAuth()
    } finally {
      // commit('SET_IS_CALL_API', false)
      // const executeTime = performance.now() - startTime
      // if (executeTime < 1000) {
      //   setTimeout(() => {
      //     // Vue.prototype.$bus.$emit('toggle-loading')
      //   }, 1000 - executeTime)
      // } else {
      //   Vue.prototype.$bus.$emit('toggle-loading')
      // }
    }
  },

  async checkUser() {
    return await this.$repositories.user.getAuth()
  },

  checkLogin({ commit }) {
    if (storage.getAuth()) {
      commit('SET_IS_LOGIN', true)
    } else {
      commit('SET_IS_LOGIN', false)
    }
  },

  async getUserProfile({ commit }) {
    commit('SET_IS_CALL_API', true)
    try {
      const { status, data } = await this.$repositories.user.getAuth()

      if (+status === successCode.OK && data) {
        commit('GET_USER_PROFILE', data)
      }
    } catch (error) {
    } finally {
      commit('SET_IS_CALL_API', false)
    }
  },

  async getUserInfo({ commit }) {
    commit('SET_IS_CALL_API', true)
    try {
      const { status, data } = await this.$repositories.user.getInfo()

      if (+status === successCode.OK && data) {
        commit('GET_USER_INFO', data)
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
  SET_IS_AUTHENTICATED(state, authenticated) {
    state.authenticated = authenticated
  },
  SET_IS_LOGIN(state, isLogin) {
    state.isLogin = isLogin
  },
  GET_USER_PROFILE(state, userProfile) {
    state.userProfile = userProfile
  },
  GET_USER_INFO(state, userInfo) {
    state.userInfo = userInfo
  },
}
