<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <b-card title="Đăng ký tài khoản" class="w-100">
        <b-form @submit.prevent="onSubmit">
          <!-- Họ và tên -->
          <b-form-group label="Họ và Tên" label-for="name" :state="validateName"
            invalid-feedback="Tên không được để trống.">
            <b-form-input id="name" v-model="formData.name" placeholder="Nhập họ và tên" required></b-form-input>
          </b-form-group>
  
          <!-- Email -->
          <b-form-group label="Email" label-for="email" :state="validateEmail"
            invalid-feedback="Vui lòng nhập email hợp lệ.">
            <b-form-input id="email" v-model="formData.email" type="email" placeholder="Nhập email"
              required></b-form-input>
          </b-form-group>
  
          <!-- Mật khẩu -->
          <b-form-group label="Mật khẩu" label-for="password" :state="validatePassword"
            invalid-feedback="Mật khẩu phải có ít nhất 8 ký tự.">
            <b-form-input id="password" v-model="formData.password" type="password" placeholder="Nhập mật khẩu"
              required></b-form-input>
          </b-form-group>
  
          <!-- Nút đăng ký -->
          <b-button type="submit" variant="danger" block>Đăng ký</b-button>
        </b-form>
        <div class="mt-3 text-center">
          <b-link @click="$router.push('/')">Đã có tài khoản? Đăng nhập</b-link>
        </div>
      </b-card>
    </div>
  </template>
  
  <script>
  import axios from 'axios'
  export default {
    data() {
      return {
        formData: {
          name: '',
          email: '',
          password: '',
        },
      }
    },
    computed: {
      validateName() {
        return this.formData.name.trim() !== ''
      },
      validateEmail() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Kiểm tra định dạng email
        return emailRegex.test(this.formData.email)
      },
      validatePassword() {
        return this.formData.password.length >= 8
      },
    },
    methods: {
      async onSubmit() {
        if (this.validateName && this.validateEmail && this.validatePassword) {
          try {
             await axios.post('http://localhost:8000/api/register',this.formData);
            alert('Đăng ký thành công!')
            this.$router.push('/')
          } catch (error) {
            alert('Đăng ký thất bại. Vui lòng thử lại.')
          }
        } else {
          alert('Vui lòng kiểm tra lại thông tin.')
        }
      },
    },
  }
  </script>
  
  <style>
  .container {
    max-width: 576px;
    height: 100vh;
  }
  </style>