import env from '~/configs/env'

export default ($axios) => ({
  uploadsMultiImage(payload) {
    return $axios.post(`${env.apiUrl}/uploads/uploads-multi-image`, payload)
  },
})
