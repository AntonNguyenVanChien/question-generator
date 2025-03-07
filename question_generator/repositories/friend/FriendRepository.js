import env from '~/configs/env'

export default ($axios) => ({
  sendFriendRequest(payload) {
    return $axios.post(`${env.apiUrl}/friend-request`, { friend_id: payload })
  },
  acceptFriend(payload) {
    return $axios.post(`${env.apiUrl}/friend-request-response`, {
      user_id: payload,
      status: 1,
    })
  },
  ignoreFriend(payload) {
    return $axios.delete(`${env.apiUrl}/friend-request-response/delete`, {
      data: { user_id: payload },
    })
  },
})
