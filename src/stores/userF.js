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
