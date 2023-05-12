import { defineStore } from 'pinia'
import { postData } from '@/api/api'

export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    token: localStorage.getItem('token'),
    user: {}
  }),

  getters: {
    isUserAuth: state => !!state.token,
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },

    setUserData(userData) {
      //
    },

    async login(payload) {
      const response = await postData('auth/login', {
        email: 'sa@test.com',
        password: '1234',
      })
      this.setToken(response.token)
    },

    async signUp(payload) {
      try {
        //
      } catch (err) {
        return Promise.reject(err)
      }
    },

    async logOut() {
      this.token = null
      localStorage.clear()
    },
  },
})
