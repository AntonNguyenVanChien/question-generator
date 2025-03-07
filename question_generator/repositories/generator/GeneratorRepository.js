// import env from '~/configs/env'

export default ($axios) => ({
  generatorKeywords(payload) {
    return $axios.post('http://localhost:5000/keyword', {
      text: payload.text,
      count: payload.count,
    })
  },

  generatorQuestions(payload) {
    return $axios.post('http://localhost:5000/generate', {
      text: payload.text,
      listKeyword: payload.listKeyword,
    })
  },
})
