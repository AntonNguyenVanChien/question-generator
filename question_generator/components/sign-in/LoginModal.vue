<template>
  <div>
    <transition name="modal-custom-fade">
      <div class="modal-custom-overlay" @click="$emit('close-modal')">
        <div class="modal-custom" @click.stop>
          <div class="top">
            <div class="title-top">
              <span>Login</span>
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
                    <b-form-group label-for="email">
                      <b-form-input id="email" v-model="email" type="email" placeholder="Email address"
                        required></b-form-input>
                    </b-form-group>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b-form-group label-for="password">
                      <b-form-input id="password" v-model="password" type="password" placeholder="New password"
                        required></b-form-input>
                    </b-form-group>
                  </td>
                </tr>
              </table>
              <button class="btn-sign-up" type="submit">Login</button>
            </b-form>
            <div class="mt-3 text-center">
              <b-link @click="$router.push('/register')">Chưa có tài khoản? Đăng ký</b-link>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { ICON, IMAGE } from '~/utils/constants'

export default {
  name: 'LoginModal',
  data: () => {
    return {
      ICON,
      IMAGE,
      email: null,
      password: null,
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault()
      this.$store.dispatch('user/auth/login', {
        email: this.email,
        password: this.password,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import 'assets/scss/modal/loginModal';
</style>
