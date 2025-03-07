import env from '~/configs/env'

export default ($axios) => ({
  login(payload) {
    return $axios.post(`${env.apiUrl}/login`, payload)
  },
  register(payload) {
    return $axios.post(`${env.apiUrl}/register`, payload)
  },
  logoutAcc() {
    return $axios.post(`${env.apiUrl}/logout`)
  },
})
