import env from '~/configs/env'

export default ($axios) => ({
  fetchQuestionBank() {
    return $axios.get(`${env.apiUrl}/question-bank`)
  },
  addQuestionToBank(payload) {
    return $axios.post(`${env.apiUrl}/question-to-bank`, payload)
  },
  showQuestionBank(payload) {
    return $axios.get(`${env.apiUrl}/question-bank/` + payload)
  },
  createTopic(payload) {
    return $axios.post(`${env.apiUrl}/question-bank`, payload)
  },
  updateTopic(payload) {
    return $axios.put(`${env.apiUrl}/question-bank/` + payload.id, {
      topic: payload.topic,
    })
  },
  deleteTopic(payload) {
    return $axios.delete(`${env.apiUrl}/question-bank/` + payload)
  },
  showQuestion(payload) {
    return $axios.get(`${env.apiUrl}/question/` + payload)
  },
  updateQuestion(payload) {
    return $axios.put(`${env.apiUrl}/question/` + payload.id, {
      question: payload.question,
      answer: payload.answer,
      distractor1: payload.distractor1,
      distractor2: payload.distractor2,
      distractor3: payload.distractor3,
    })
  },
  deleteQuestion(payload) {
    return $axios.delete(`${env.apiUrl}/question/` + payload)
  },
})
