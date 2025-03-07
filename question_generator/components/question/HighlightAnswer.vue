<template>
  <div>
    <p class="sent">
      <span
        v-for="(word, index) in words"
        :key="index"
        :class="defineClassHighlight(word, index)"
        @mousedown="startSelection(index)"
        @mouseup="endSelection(index)"
      >
        <!-- style="{
          backgroundColor: word.highlight ? highlightColor : 'transparent',
          color: word.highlight ? textColor : 'inherit',
        }" -->
        {{ word.text }}

        <!-- Hiển thị nút Xóa khi từ được highlight -->

        <span
          v-if="word.highlight && word.isEnd"
          class="remove-highlight"
          @click="removeHighlight(index)"
        >
          <b-img class="icon-remove-highlight" :src="ICON.close"></b-img>
        </span>
      </span>
    </p>

    <div v-if="currentSelect" class="selection-keywords">
      <span class="tt">Selection Keywords:</span>
      <span class="word-selection">{{ currentSelect }}</span>
      <button class="btn-add-to-keywords" @click="highlightSelectedWords">
        Add to Keywords
      </button>
    </div>
  </div>
</template>

<script>
import { ICON } from '~/utils/constants'

export default {
  name: 'HighlightAnswer',
  props: {
    paragraph: Array,
    keywordRanges: Array,
  },
  data() {
    return {
      ICON,
      words: [],
      highlightColor: 'yellow',
      textColor: 'black',
      selectionStart: -1,
      selectionEnd: -1,
      selectedRanges: [],
      keywordSelectedRanges: [],

      currentSelect: '',
    }
  },

  mounted() {
      this.words = this.paragraph.flatMap(({ sent, indexSent }) => {
        const wordsInSentence = sent.match(/([^\s.,!?()[\]{}]+|[.,!?()[\]{}])/g).map((word, index) => ({
          text: word,
          highlight: false,
          indexSent,
          indexWord: index,
        }))
        return wordsInSentence
      })
      this.findKeywordRanges(this.keywordRanges, this.words)

      this.highlightWordsFirst()
  },

  methods: {
    startSelection(index) {
      this.selectionStart = index
      this.selectionEnd = index
    },
    endSelection(index) {
      this.selectionEnd = index

      const selectedWords = this.words.slice(
        this.selectionStart,
        this.selectionEnd + 1
      )
      this.currentSelect = selectedWords.map((word) => word.text).join(' ')
    },

    highlightSelectedWords() {
      const start = Math.min(this.selectionStart, this.selectionEnd)
      const end = Math.max(this.selectionStart, this.selectionEnd) + 1

      for (let i = start; i < end; i++) {
        if (i === end - 1) {
          this.$set(this.words, i, {
            ...this.words[i],
            highlight: true,
            isEnd: true,
          })
        } else {
          this.$set(this.words, i, {
            ...this.words[i],
            highlight: true,
            isEnd: false,
          })
        }
      }

      const selectedWords = this.words.slice(
        this.selectionStart,
        this.selectionEnd + 1
      )
      const selectedText = selectedWords.map((word) => word.text).join(' ')
      this.keywordSelectedRanges.push({
        word: selectedText,
        prob: 1,
        indexSent: this.words[this.selectionStart].indexSent,
      })

      this.$emit('getListKeywordSelected', this.keywordSelectedRanges)

      this.selectedRanges.push({ start, end: end - 1 })

      this.selectionStart = -1
      this.selectionEnd = -1

      this.currentSelect = ''
    },

    removeHighlight(index) {
      this.currentSelect = ''

      const removeIndex = this.selectedRanges.findIndex(
        (range) => range.end === index
      )

      if (removeIndex !== -1) {
        const { start, end } = this.selectedRanges[removeIndex]
        for (let i = start; i <= end; i++) {
          this.$set(this.words, i, {
            ...this.words[i],
            highlight: false,
            isEnd: false,
          })
        }
        this.selectedRanges.splice(removeIndex, 1)

        const selectedWords = this.words.slice(start, end + 1)
        const selectedText = selectedWords.map((word) => word.text).join(' ')

        const indexToRemove = this.keywordSelectedRanges.some(
          (item) => item.word === selectedText
        )

        if (indexToRemove !== -1) {
          this.keywordSelectedRanges = this.keywordSelectedRanges.filter(
            (item) => item.word !== selectedText
          )

          this.$emit('getListKeywordSelected', this.keywordSelectedRanges)
        }
      }
    },

    findKeywordRanges(keywordRanges, words) {
      // const selectedRanges = []

      for (const keyword of keywordRanges) {
        const keywordArray = keyword.word.split(' ')

        for (let i = 0; i < words.length; i++) {
          const currentWord = words[i].text
          if (
            currentWord === keywordArray[0] &&
            i + keywordArray.length <= words.length
          ) {
            let match = true

            for (let j = 1; j < keywordArray.length; j++) {
              if (words[i + j].text !== keywordArray[j]) {
                match = false
                break
              }
            }

            if (match) {
              const exists = this.keywordSelectedRanges.find(
                (item) => item.word === keyword.word
              )

              if (!exists) {
                this.keywordSelectedRanges.push({
                  word: keyword.word,
                  prob: keyword.prob,
                  indexSent: words[i].indexSent,
                })
                this.selectedRanges.push({
                  start: i,
                  end: i + keywordArray.length - 1,
                })

                this.$emit('getListKeywordSelected', this.keywordSelectedRanges)
              }
            }
          }
        }
      }

      // return selectedRanges
    },

    highlightWordsFirst() {
      for (const keyword of this.selectedRanges) {
        for (let i = keyword.start; i <= keyword.end; i++) {
          if (i === keyword.end) {
            this.$set(this.words, i, {
              ...this.words[i],
              highlight: true,
              isEnd: true,
            })
          } else {
            this.$set(this.words, i, {
              ...this.words[i],
              highlight: true,
              isEnd: false,
            })
          }
        }
      }
    },

    defineClassHighlight(word, index) {
      if (word.highlight) {
        return 'highlighted-text'
      }

      if (this.words[index - 1]) {
        if (this.words[index - 1].highlight === true) {
          return 'next'
        }
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

<style lang="scss" scoped>
@import 'assets/scss/main/highlightAnswer';
</style>
