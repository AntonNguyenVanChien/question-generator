import { successCode } from '~/utils/constants'
import storage from '~/utils/helpers/storage'

export default async function ({ store, redirect }) {
  if (storage.getAuth()) {
    try {
      const { status, data } = await store.dispatch('user/auth/checkUser')
      if (+status === successCode.OK) {
        store.commit('user/auth/SET_IS_LOGIN', true)
        store.commit('user/auth/SET_IS_AUTHENTICATED', true)
        store.commit('user/auth/GET_USER_PROFILE', data)
      }
    } catch (error) {
      storage.deleteAuth()
      store.commit('user/auth/SET_IS_LOGIN', false)
      store.commit('user/auth/SET_IS_AUTHENTICATED', false)
      // await redirect({ name: SCREEN_PATH.TOP })
    }
  } else {
    store.commit('user/auth/SET_IS_LOGIN', false)
    // await redirect({ name: SCREEN_PATH.TOP })
  }
}
