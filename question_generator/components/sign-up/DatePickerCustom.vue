<template>
  <div class="">
    <div class="choosen-date">
      <select v-model="selectedDay">
        <option v-for="day in days" :key="day">{{ day }}</option>
      </select>
      <select v-model="selectedMonth">
        <option v-for="(month, index) in months" :key="index + 1">
          {{ month }}
        </option>
      </select>
      <select v-model="selectedYear">
        <option v-for="year in years" :key="year">{{ year }}</option>
      </select>
    </div>
    <div v-if="isDateValid" class="valid-message">Ngày hợp lệ</div>
    <div v-else class="invalid-message">Ngày không hợp lệ</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      days: Array.from({ length: 31 }, (_, i) => i + 1),
      months: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12',
      ],
      years: Array.from(
        { length: 100 },
        (_, i) => new Date().getFullYear() - i
      ),
      selectedDay: null,
      selectedMonth: null,
      selectedYear: null,
      monthMapping: {
        'Tháng 1': 1,
        'Tháng 2': 2,
        'Tháng 3': 3,
        'Tháng 4': 4,
        'Tháng 5': 5,
        'Tháng 6': 6,
        'Tháng 7': 7,
        'Tháng 8': 8,
        'Tháng 9': 9,
        'Tháng 10': 10,
        'Tháng 11': 11,
        'Tháng 12': 12,
      },
    }
  },
  computed: {
    isDateValid() {
      const selectedMonthIndex = this.months.indexOf(this.selectedMonth)
      if (selectedMonthIndex === -1) {
        return false // Tháng không hợp lệ
      }

      const maxDaysInMonth = new Date(
        this.selectedYear,
        selectedMonthIndex + 1,
        0
      ).getDate()

      return this.selectedDay >= 1 && this.selectedDay <= maxDaysInMonth
    },

    selectedDate() {
      return {
        day: this.selectedDay,
        month: this.monthMapping[this.selectedMonth],
        year: this.selectedYear,
      }
    },
  },
  watch: {
    selectedDate(newValue) {
      this.$emit('update:selectedDate', newValue)
    },
  },
}
</script>

<style lang="scss" scoped>
/* Thêm CSS tùy chỉnh cho datepicker tại đây */
.valid-message {
  color: green;
}

.invalid-message {
  color: red;
}

.choosen-date {
  width: 100%;
  display: flex;
  justify-content: space-between;

  select {
    flex: 1;
    height: 36px;
    margin-right: 20px;
    border: 1px solid #ccd0d5;
    border-radius: 3px;
    font-size: 16px;

    &:last-child {
      margin-right: 0;
    }
  }
}
</style>
