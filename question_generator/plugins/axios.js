import Vue from 'vue'
import storage from '~/utils/helpers/storage'
import { errorCode, errorMessage, SCREEN_PATH } from '~/utils/constants'

export default (context) => {
  const { $axios, store, app, error } = context

  $axios.onRequest((config) => {
    config.headers.common.Authorization = `Bearer ${storage.getAuth()}`
    config.headers.common.Accept = 'application/json'
  })

  $axios.onResponse(() => {})

  $axios.onError((err) => {
    if (err.response) {
      const { status, data } = err.response
      switch (+status) {
        case errorCode.BAD_REQUEST:
          return Promise.reject(err)
        case errorCode.UNAUTHORIZED:
          if (storage.getAuth()) storage.deleteAuth()

          store.commit('user/auth/SET_IS_AUTHENTICATED', false)
          app.router.push({ name: SCREEN_PATH.SIGN_IN })
          Vue.prototype.$bus.$emit('server-error', {
            error: 'forceLogout',
          })
          break
        case errorCode.PAGE_NOT_FOUND:
          if (data && data.error !== errorMessage.THE_PORTAL_CODE_NOT_FOUND)
            return error({ statusCode: 404 })
      }
    }
  })
}
