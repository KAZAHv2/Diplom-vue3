import { editData, getData, postData } from '@/api/http/apiService'
import { defineStore } from 'pinia'
import router from '../router'



// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import {getAuth} from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBK-6H5yNztvGBnn1AT7yh13xxXs16bR-U",
  authDomain: "diplom-5ae23.firebaseapp.com",
  projectId: "diplom-5ae23",
  storageBucket: "diplom-5ae23.appspot.com",
  messagingSenderId: "209774935604",
  appId: "1:209774935604:web:8fba49382a7a8d40499461",
  measurementId: "G-X4BTVV1H8B",
}

// Initialize Firebase
initializeApp(firebaseConfig)

export const db = getFirestore()

export const auth = getAuth()



export const useUserStore = defineStore({
  id: 'user',

  state: () => ({
    token: localStorage.getItem('token'),
    user: {},
    tokenValid: false,
  }),

  getters: {
    isUserAuth: state => !!state.token,
    getUserData: state => state.user,
    tokenIsValid: state => state.tokenValid
  },

  actions: {
    setToken(token) {
      this.token = token
      localStorage.setItem('token', token)
    },
    async checkToken(){
      try{
        const response = await getData('users');
        if(response.id){
          this.tokenValid=true;
        }
        else{
          this.tokenValid = false;
        }
      }
      catch(err){
        this.tokenValid = false
      }
      
    },
    async fetchUserData() {
      const response = await getData('users');
      this.user = response
      return response
    },
    async login(payload) {
      const response = await postData('auth/login', payload)
      this.setToken(response.token)
      router.replace('/')
    },

    async signUp(payload) {
      const response = await postData('auth/register', payload)
      this.setToken(response.token)
      router.replace('/')
    },

    async logout() {
      this.token = null
      localStorage.clear()
      router.replace('/login')
    },
    async changeUserName(enteredName) {
      const newName={
        name: enteredName
      }
      const response = await editData('users', newName);
    },
    async changePassword(oldPassword, newPassword) {
      const passwords={
        oldPassword: oldPassword,
        newPassword: newPassword,
      }
      const userData = await this.fetchUserData();
      await postData('auth/change-pwd', passwords)
      const response = await postData('auth/login', {
        email: userData.email,
        password: newPassword,
      })
      this.setToken(response.token)
    },
  },
})
