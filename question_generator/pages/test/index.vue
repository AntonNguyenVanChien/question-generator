<template>
  <div>
    <p>
      <span
        v-for="(word, index) in words"
        :key="index"
        :style="{
          backgroundColor: word.highlight ? highlightColor : 'transparent',
          color: word.highlight ? textColor : 'inherit',
        }"
        @mousedown="startSelection(index)"
        @mouseup="endSelection(index)"
      >
        {{ word.text }}

        <!-- Hiển thị nút Xóa khi từ được highlight -->
        <button
          v-if="word.highlight && word.isEnd"
          @click="removeHighlight(index)"
        >
          Xóa
        </button>
      </span>
    </p>
    <button @click="highlightSelectedWords">
      Thêm nền cho từ được bôi đen
    </button>

    {{ keywordSelectedRanges }}

    {{ selectedRanges }}
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      // paragraph:
      // 'Cát là vật liệu dạng hạt nguồn gốc tự nhiên bao gồm các hạt đá và khoáng vật nhỏ và mịn. Cát được dùng như là một khoáng vật trong lĩnh vực địa chất học.',
      words: [],
      highlightColor: 'yellow',
      textColor: 'black',
      selectionStart: -1,
      selectionEnd: -1,
      selectedRanges: [],

      paragraph: [
        {
          sent: 'Cát là vật liệu dạng hạt nguồn gốc tự nhiên bao gồm các hạt đá và khoáng vật nhỏ và mịn.',
          indexSent: 0,
        },
        {
          sent: 'Khi được dùng như là một thuật ngữ trong lĩnh vực địa chất học, kích thước cát hạt cát theo đường kính trung bình nằm trong khoảng từ 0,0625 mm tới 2 mm (thang Wentworth sử dụng tại Hoa Kỳ) hay từ 0,05 mm tới 1 mm (thang Kachinskii sử dụng tại Nga và Việt Nam hiện nay).',
          indexSent: 1,
        },
        {
          sent: 'Một hạt vật liệu tự nhiên nếu có kích thước nằm trong các khoảng này được gọi là hạt cát.',
          indexSent: 2,
        },
        {
          sent: 'Lớp kích thước hạt nhỏ hơn kế tiếp trong địa chất học gọi là đất bùn (Mỹ) với các hạt có đường kính nhỏ hơn 0,0625 mm cho tới 0,004 mm hoặc bụi (Nga) với các hạt có đường kính nhỏ hơn 0,05 mm cho tới 0,001 mm.',
          indexSent: 3,
        },
        {
          sent: 'Lớp kích thước hạt lớn hơn kế tiếp là sỏi/cuội với đường kính hạt nằm trong khoảng từ 2 mm tới 64 mm (Mỹ) hay từ 1 tới 3 mm (Nga).',
          indexSent: 4,
        },
        {
          sent: 'Xem thêm bài kích thước hạt để biết thêm về các tiêu chuẩn được sử dụng.',
          indexSent: 5,
        },
        {
          sent: 'Khi cọ xát giữa các ngón tay thì cát tạo ra cảm giác sàn sạn (chứ không như đất bùn tạo cảm giác trơn như bột).',
          indexSent: 6,
        },
      ],

      keywordRanges: [
        { word: 'vật liệu', prob: 1 },
        // { word: 'nguồn gốc', prob: 1 },
        // { word: 'tự nhiên', prob: 1 },
        // { word: 'bao gồm', prob: 1 },
        // { word: 'khoáng vật', prob: 1 },
        // { word: 'thuật ngữ', prob: 1 },
        // { word: 'lĩnh vực', prob: 1 },
        // { word: 'địa chất học', prob: 1 },
      ],

      keywordSelectedRanges: [],
    }
  },

  mounted() {
    // this.words = this.paragraph
    //   .split(' ')
    //   .map((word) => ({ text: word, highlight: false }))

    this.words = this.paragraph.flatMap(({ sent, indexSent }) => {
      const wordsInSentence = sent.split(/\s+/).map((word, index) => ({
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

      this.selectedRanges.push({ start, end: end - 1 })

      this.selectionStart = -1
      this.selectionEnd = -1
    },

    removeHighlight(index) {
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
  },
}
</script>

<style lang="scss" scoped></style>
