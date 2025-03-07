<template>
  <div>
    <transition name="modal-custom-fade">
      <div class="modal-custom-overlay" @click="$emit('close-modal')">
        <div class="modal-custom" @click.stop>
          <div class="top">
            <div class="title-top">
              <span>Sign Up</span>
            </div>
            <div class="close-post-show-modal" @click="$emit('close-modal')">
              <b-img :src="ICON.close"></b-img>
            </div>
          </div>
          <div class="content">
            <b-form @submit.stop="onSubmit">
              <table>
                <tr>
                  <td>
                    <b-form-group label-for="name">
                      <b-form-input
                        id="name"
                        v-model="name"
                        type="text"
                        placeholder="Full name"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b-form-group label-for="email">
                      <b-form-input
                        id="email"
                        v-model="email"
                        type="email"
                        placeholder="Email address"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b-form-group label-for="password">
                      <b-form-input
                        id="password"
                        v-model="password"
                        type="password"
                        placeholder="New password"
                        required
                      ></b-form-input>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <date-picker-custom @update:selectedDate="selectedDate" />
                  </td>
                </tr>
                <tr>
                  <b-form-group>
                    <b-form-radio-group
                      id="radio-group-1"
                      v-model="gender"
                      name="radio-options"
                    >
                      <td>
                        <div class="choosen-gender">
                          <span class="title-gender">Fmale</span>
                          <b-form-radio value="1"></b-form-radio>
                        </div>
                      </td>
                      <td>
                        <div class="choosen-gender">
                          <span class="title-gender">Male</span>
                          <b-form-radio value="0"></b-form-radio>
                        </div>
                      </td>
                    </b-form-radio-group>
                  </b-form-group>
                </tr>
              </table>
              <button class="btn-sign-up" type="submit">Sign Up</button>
            </b-form>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ICON, IMAGE } from '~/utils/constants'

import DatePickerCustom from '~/components/sign-up/DatePickerCustom'

export default {
  name: 'RegisterModal',
  components: {
    DatePickerCustom,
  },
  data: () => {
    return {
      ICON,
      IMAGE,
      name: null,
      email: null,
      password: null,
      gender: null,
      date: null,
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      this.$store.dispatch('user/auth/register', {
        name: this.name,
        email: this.email,
        password: this.password,
        date_of_birth: this.date,
        gender: this.gender,
      })
    },
    selectedDate(date) {
      this.date = date.year + '-' + date.month + '-' + date.day
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/modal/registerModal';
</style>
