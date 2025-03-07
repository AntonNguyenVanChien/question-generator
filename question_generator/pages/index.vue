 
<template>
  <div class="content-bottom">
    <div class="content-bottom-left col-3">

      <h6 class="title-content-bottom-left">Upload Text File</h6>
      <input type="file" @change="handleFileUpload"  />
      <h6 class="title-content-bottom-left">1. Content</h6>
      <b-textarea v-model="content" class="content-input"></b-textarea>
      <h6 class="title-content-bottom-left">2. Question Count</h6>
      <div class="progesbar-count">
        <div class="wrapper-display-sider-count">
          <b-input
            v-model="sliderCount"
            class="display-sider-count"
            type="number"
          />
        </div>
        <b-input
          v-model="sliderCount"
          class="sider-count"
          type="range"
          min="1"
          max="20"
          step="1"
        />
      </div>

      <h6 class="title-content-bottom-left">3. Difficulty Level</h6>
      <b-form-select v-model="selectedLevel">
        <option value="1">Easy</option>
        <option value="2">Medium</option>
        <option value="3">Hard</option>
      </b-form-select>
      <h6 class="title-content-bottom-left">4. Language</h6>
      <b-form-select v-model="selectedLanguage">
        <option value="vi">Vietnamese</option>
      </b-form-select>
      <div class="wrapper-generate-content">
        <button class="generate-content" @click="generatorKeywords" :disabled="content.split(' ').length<=20">
          Generate Content
        </button>
        <script>
          export default {
            data() {
              return {
                content: ''
              };
            },
            methods: {
              generatorKeywords() {
                // Your function logic for generating content
              }
            }
          };
        </script>
      </div>
    </div>
    <div class="content-bottom-right col-9">
      <div v-if="listAnswerGen === null" class=""></div>

      <div v-else class="">
        <ul class="list-step">
          <li v-if="activeTabOutput === 0" class="active">
            <h6>Identify Keywords</h6>
          </li>
          <li v-else class="in-active" @click="ChangeActiveTabOutput(0)">
            <h6>Identify Keywords</h6>
          </li>
          <li v-if="activeTabOutput === 1" class="active">
            <h6>List question</h6>
          </li>
          <li v-else class="in-active" @click="ChangeActiveTabOutput(1)">
            <h6>List question</h6>
          </li>
        </ul>
        <div v-if="activeTabOutput == 0 && listAnswerGen" class="">
          <div class="custom-keyword">
            <div class="list-keywords">
              <ul>
                <li
                  v-for="(keyword, keywordKey) in listKeywordSelected"
                  :key="keywordKey"
                >
                  <p>
                    {{ keywordKey + 1 }}. {{ keyword.word }} :
                    <!-- {{ keyword.prob }} -->
                  </p>
                </li>
              </ul>
            </div>

            <div class="custom-content">
              <highlight-answer
                :paragraph="paragraph"
                :keywordRanges="keywordRanges"
                @getListKeywordSelected="handleListKeywordSelected"
              ></highlight-answer>
            </div>
          </div>

          <button
            :disabled="listKeywordSelected.length === 0"
            class="btn-generation-questions"
            @click="generatorQuestions"
          >
            Generate Questions
          </button>
        </div>
        <div v-if="activeTabOutput == 1" class="">
          <div v-if="listQAGen" class="list-qa-gen">
            <div
              v-for="(question, questionKey) in listQAGen"
              :key="questionKey"
            >
              <b-form-checkbox-group
                v-model="selectedQuestion"
                name="flavour-1a"
              >
                <b-form-checkbox :value="questionKey">
                  <h6>
                    Question {{ questionKey + 1 }}. {{ question.question }}
                  </h6>
                  <p>Answer: {{ question.answer }}</p>
                  <div v-if="question.list_distractor" class="">
                    <p
                      v-for="(
                        distractor, distractorKey
                      ) in question.list_distractor"
                      :key="distractorKey"
                    >
                      Distractor {{ distractorKey + 1 }}: {{ distractor }}
                    </p>
                  </div>
                </b-form-checkbox>
              </b-form-checkbox-group>
            </div>
            <button class="check-all-btn" @click="checkedAllQuestion">
              Choosen All
            </button>
            <center>
              <button
                class="add-to-bank-btn"
                :disabled="selectedQuestion.length === 0"
                @click="btnShowModalChoosenBankAdd"
              >
                Add to Question Bank
              </button>
            </center>
          </div>

          <!-- <button @click="backStep1">Back</button> -->
        </div>
      </div>
    </div>
    <choosen-bank-add-modal
      v-if="showChoosenBankAddModal"
      :list_question_add="listQuestionAdd"
      @close-modal="showChoosenBankAddModal = false"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import mammoth from 'mammoth';
import ChoosenBankAddModal from '~/components/question/ChoosenBankAddModal'


import HighlightAnswer from '~/components/question/HighlightAnswer'



export default {
  name: 'IndexPage',
  components: {
    ChoosenBankAddModal,
    HighlightAnswer,
  },
  layout: 'default_home',
  data() {
    return {
      content: '',
      sliderCount: 10,
      selectedLevel: '2',
      selectedLanguage: 'vi',
      showChoosenBankAddModal: false,
      selectedQuestion: [],
      listQuestionAdd: [],
      activeTabOutput: 0,

      // paragraph:
      // 'Cát là vật liệu dạng hạt nguồn gốc tự nhiên bao gồm các hạt đá và khoáng vật nhỏ và mịn.Khi được dùng như là một thuật ngữ trong lĩnh vực địa chất học, kích thước cát hạt cát theo đường kính trung bình nằm trong khoảng từ 0,0625 mm tới 2 mm (thang Wentworth sử dụng tại Hoa Kỳ) hay từ 0,05 mm tới 1 mm (thang Kachinskii sử dụng tại Nga và Việt Nam hiện nay).Một hạt vật liệu tự nhiên nếu có kích thước nằm trong các khoảng này được gọi là hạt cát.Lớp kích thước hạt nhỏ hơn kế tiếp trong địa chất học gọi là đất bùn (Mỹ) với các hạt có đường kính nhỏ hơn 0,0625 mm cho tới 0,004 mm hoặc bụi (Nga) với các hạt có đường kính nhỏ hơn 0,05 mm cho tới 0,001 mm.Lớp kích thước hạt lớn hơn kế tiếp là sỏi/cuội với đường kính hạt nằm trong khoảng từ 2 mm tới 64 mm (Mỹ) hay từ 1 tới 3 mm (Nga).Xem thêm bài kích thước hạt để biết thêm về các tiêu chuẩn được sử dụng.Khi cọ xát giữa các ngón tay thì cát tạo ra cảm giác sàn sạn (chứ không như đất bùn tạo cảm giác trơn như bột).',
      paragraph: '',

      // keywordRanges: [
      //   { word: 'vật liệu', prob: 1 },
      //   { word: 'nguồn gốc', prob: 1 },
      //   { word: 'tự nhiên', prob: 1 },
      //   { word: 'bao gồm', prob: 1 },
      //   { word: 'khoáng vật', prob: 1 },
      //   { word: 'thuật ngữ', prob: 1 },
      //   { word: 'lĩnh vực', prob: 1 },
      //   { word: 'địa chất học', prob: 1 },
      // ],

      keywordRanges: [],

      listKeywordSelected: [],
    }
  },
  computed: {
    ...mapState({
      isCallApi: (state) => state.generator.generator.isCallApi,
      listAnswerGen: (state) => state.generator.generator.listAnswerGen,
      listQAGen: (state) => state.generator.generator.listQAGen,
    }),
  },

  watch: {
    listAnswerGen() {
      this.keywordRanges = this.listAnswerGen.listAnswer.slice()
      this.paragraph = this.listAnswerGen.listSent.slice()
    },
  },

  mounted() {
    const self = this
    this.$nextTick(() => {
      self.$bus.$on('add-questions-to-bank-done', () => {
        this.showChoosenBankAddModal = false
      })

      self.$bus.$on('gen-list-qa-done', () => {
        this.activeTabOutput = 1
      })
    })
  },

  beforeDestroy() {
    this.$store.commit('generator/generator/SET_LIST_ANSWER_GEN', null)
    this.$store.commit('generator/generator/SET_LIST_QA_GEN', null)
  },

  methods: {
    async generatorKeywords() {
      await this.$store.dispatch('generator/generator/generatorKeywords', {
        text: this.content,
        count: this.sliderCount,
      })
    },

    async generatorQuestions() {
      await this.$store.dispatch('generator/generator/generatorQuestions', {
        text: this.content,
        listKeyword: this.listKeywordSelected,
      })
    },

    checkedAllQuestion(value) {
      this.selectedQuestion = this.listQAGen.map((item, index) => index)
    },

    btnShowModalChoosenBankAdd() {
      this.listQuestionAdd = this.listQAGen.filter((value, index) =>
        this.selectedQuestion.includes(index)
      )

      this.showChoosenBankAddModal = true
    },

    ChangeActiveTabOutput(tab) {
      this.activeTabOutput = tab
    },

    handleListKeywordSelected(listKeyword) {
      this.listKeywordSelected = listKeyword

      this.keywordRanges = listKeyword.slice()
    },

    backStep1() {
      this.activeTabOutput = 0
    },

     async handleFileUpload(event) {
    const file = event.target.files[0];
    // const fileInput = event.target;
    if (file) {
      const fileType = file.type;

      if (fileType === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.content = e.target.result; // Đọc nội dung file TXT
          console.log( e.target.result)
        };
        reader.readAsText(file);

      } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        // Đọc file DOCX
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        this.content = result.value; // Lưu nội dung của file DOCX
        console.log(result.value)
      } else {
        alert('Please upload a valid TXT, DOCX, or PDF file.');
      }
      // fileInput.value = '';

    }
  },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/main';
@import 'assets/scss/main/home';
@import 'assets/scss/animation';

.loading-post {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.loading-wrapper {
  span {
    position: absolute;
    display: block;
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: speed 2s infinite ease-in-out;

    &.one {
      background: #4285f4;
      animation-delay: 1.5s;
    }

    &.two {
      background: #ea4335;
      animation-delay: 1s;
    }

    &.three {
      background: #fbbc05;
      animation-delay: 0.5s;
    }

    &.four {
      background: #34a853;
    }
  }
}
</style>
