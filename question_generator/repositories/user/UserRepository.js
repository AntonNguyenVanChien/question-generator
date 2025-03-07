import env from '~/configs/env'

const resource = 'users'

export default ($axios) => ({
  getAuth() {
    return $axios.get(`${env.apiUrl}/user/auth`)
  },
  fetchUser(id) {
    return $axios.get(`${env.apiUrl}/${resource}/${id}`)
  },
  allFriends(id) {
    return $axios.get(`${env.apiUrl}/${resource}/${id}/all-friends`)
  },
})
