<template>
  <div class="aaa123">
    <p>{{ this.highlightedWords }}</p>
    <p ref="mydiv" v-html="highlightedText" @mouseup="handleMouseUp"></p>
    <button
      v-if="showAddButton"
      class="btnAddWords"
      :style="buttonStyle"
      @click="addHighlightedWord"
    >
      Thêm từ
    </button>
  </div>
</template>

<script>
export default {
  name: 'HighlightAnswer',
  props: {
    text: Array,
    highlightedWords: Array,
  },
  data() {
    return {
      wordSpans: [],
      selectedText: '',
      showAddButton: false,
      buttonStyle: { top: '0', left: '0' },
    }
  },
  computed: {
    highlightedText() {
      if (!this.text || !this.highlightedWords) {
        return ''
      }

      const regex = new RegExp(
        `(${this.highlightedWords.map((obj) => obj.word).join('|')})`,
        'gi'
      )
      let index = 0
      return this.text.replace(regex, (match) => {
        const wordObj = this.highlightedWords.find(
          (obj) => obj.word.toLowerCase() === match.toLowerCase()
        )
        if (wordObj) {
          const span = `<span class="highlight" data-index="${index}" data-prob="${wordObj.prob}">${match}</span>`
          index++
          return span
        } else {
          return match
        }
      })

      // let result = ''

      // this.text.forEach((sent) => {
      //   if (this.highlightedWords.length > 0) {
      //     const regex = new RegExp(
      //       `(${this.highlightedWords.map((obj) => obj.word).join('|')})`,
      //       'gi'
      //     )

      //     let index = 0
      //     const sentFinded = sent.sent.replace(regex, (match) => {
      //       const wordObj = this.highlightedWords.find(
      //         (obj) => obj.word === match
      //       )
      //       if (wordObj) {
      //         const span = `<span class="highlight" data-index="${index}" data-prob="${wordObj.prob}">${match}</span>`
      //         index++

      //         const isWordInArray = this.highlightedWords.findIndex(
      //           (item) => item.word === match
      //         )

      //         if (isWordInArray !== -1) {
      //           this.$emit('removeWord', isWordInArray)
      //         }

      //         // const isWordInArray = this.highlightedWords.some(
      //         //   (item) => item.word === match
      //         // )

      //         // if (isWordInArray) {
      //         //   this.highlightedWords = this.highlightedWords.filter(
      //         //     (item) => item.word !== match
      //         //   )
      //         // }

      //         return span
      //       }
      //     })

      //     result = result.concat(sentFinded)
      //   } else {
      //     result = result.concat(sent.sent)
      //   }
      // })

      // return result
    },
  },
  watch: {
    highlightedText() {
      this.$nextTick(() => {
        this.wordSpans = this.$refs.mydiv.querySelectorAll('.highlight')
        this.wordSpans.forEach((span) => {
          span.addEventListener('click', this.handleWordClick)
        })
      })
    },

    highlightedWords() {
      // console.log(this.highlightedWords)
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.wordSpans = this.$refs.mydiv.querySelectorAll('.highlight')
      this.wordSpans.forEach((span) => {
        span.addEventListener('click', this.handleWordClick)
      })
    })
  },

  methods: {
    handleWordClick(event) {
      const clickedSpan = event.target
      const clickedWord = clickedSpan.textContent

      const wordIndex = this.highlightedWords.findIndex(
        (item) => item.word === clickedWord
      )

      if (wordIndex !== -1) {
        this.$emit('removeWord', wordIndex)
        // this.highlightedWords.splice(wordIndex, 1)
      }

      clickedSpan.replaceWith(clickedWord)
    },

    handleMouseUp() {
      const selection = window.getSelection()
      this.selectedText = selection.toString().trim()

      // Hiển thị nút thêm từ nếu có chữ được bôi đen
      // this.showAddButton = this.selectedText.length > 0

      if (this.selectedText.length > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()

        const top = rect.top - 170
        const left = rect.left - 800

        this.buttonStyle = {
          top: `${top}px`,
          left: `${left}px`,
        }

        this.showAddButton = true
      } else {
        this.showAddButton = false
      }
    },

    addHighlightedWord() {
      if (this.selectedText) {
        // this.highlightedWords.push({ word: this.selectedText, prob: 1 })
        this.$emit('addWord', { word: this.selectedText, prob: 1 })
        this.showAddButton = false
      }
    },
  },
}
</script>

<style lang="scss">
.highlight {
  background-color: yellow;
  font-weight: bold;
  color: red;
}
</style>

<style lang="scss" scoped></style>
