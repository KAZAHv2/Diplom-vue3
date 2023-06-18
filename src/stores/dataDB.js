import { defineStore } from 'pinia'
import { set, ref, child, update, remove, onValue, get } from "firebase/database"
import firebase from 'firebase/compat'
import {auth, db} from '@/stores/user'

export const DataDB = defineStore({
  id: 'DataDB',

  state: () => ({

  }),

  getters: {

  },

  actions: {

    async addTask(payload){
      console.log(payload)
      await set(ref(db, `/${auth.currentUser.uid}/Category/` + payload.category_id + `/User_Task/` + payload.uuid),
        {
          name: payload.name,
          taskId : payload.uuid,
          description: payload.description,
          date: payload.date,
          date_do: payload.Ldate,
          clietn_id: payload.clietn_id,
          maket_link: payload.maket_link,
          client_name: payload.client_name,
          category_name:  payload.category_name,
          category_id:  payload.category_id,
          status: false,
        })
        .then(() => {
          console.log("Gotovo")
        })
    },

    async addСustomer(payload){
      console.log(payload)
      await set(ref(db, `/${auth.currentUser.uid}/Customer/` + payload.customerID),
        {
          name: payload.name,
          customerId : payload.customerID,
          description: payload.description,
          email: payload.email,
          phone: payload.phone,
        })
        .then(() => {
          console.log("Gotovo")
        })
    },

    async addCategory(payload){
      console.log(payload)
      await set(ref(db, `/${auth.currentUser.uid}/Category/` + payload.categoryId),
        {
          name: payload.name,
          categoryId : payload.categoryId,
        })
        .then(() => {
          console.log("Gotovo")
        })
    },

    async updateCategory(payload){
      await update(ref(db, `/${auth.currentUser.uid}/Category/` + payload.categoryId),
        {
          name: payload.name,
        })
        .then(() => {
          console.log("Update")
        })
    },

    async fetchCategory() {
      const dbRef = ref(db)
      try {
        const snapshot = await get(child(dbRef, `/${auth.currentUser.uid}/Category/`))
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          console.log("No data available")

          return null
        }
      } catch (error) {
        console.error(error)

        return null
      }
    },

    async fetchTasks() {
      const dbRef = ref(db)
      try {
        const snapshot = await get(child(dbRef, `/${auth.currentUser.uid}/User_Task/`))
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          console.log("No data available")

          return null
        }
      } catch (error) {
        console.error(error)

        return null
      }
    },

    async fetchCustomers() {
      const dbRef = ref(db)
      try {
        const snapshot = await get(child(dbRef, `/${auth.currentUser.uid}/Customer/`))
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          console.log("No data available")

          return null
        }
      } catch (error) {
        console.error(error)

        return null
      }
    },



    async updateTask(payload){
      console.log(payload)
      await update(ref(db, `/${auth.currentUser.uid}/Category/` + payload.category_id + `/User_Task/` + payload.uuid),
        {
          name: payload.name,
          description: payload.description,
          date_do: payload.Ldate,
          clietn_id: payload.clietn_id,
          maket_link: payload.maket_link,
          client_name: payload.client_name,
          category_name:  payload.category_name,
          category_id:  payload.category_id,
        })
        .then(() => {
          console.log("Update")
        })
    },

    async updateStatus(payload){
      await update(ref(db, `/${auth.currentUser.uid}/Category/` + payload.category_id + `/User_Task/` + payload.taskId),
        {
          status: payload.status,
        })
        .then(() => {
          console.log("Update")
        })
    },


    async removeTask(payload){
      await remove(ref(db, `/${auth.currentUser.uid}/Category/` + payload.category_id + `/User_Task/` + payload.taskId))
        .then(() => {
          console.log("Delete")
        })
    },
    async removeCustomer(payload){
      await remove(ref(db, `/${auth.currentUser.uid}/Customer/` + payload.customerId))
        .then(() => {
          console.log("Delete")
        })
    },
    async removeCategory(payload){
      await remove(ref(db, `/${auth.currentUser.uid}/Category/` + payload))
        .then(() => {
          console.log("Delete")
        })
    },
    async updateCustomer(payload){
      await update(ref(db, `/${auth.currentUser.uid}/Customer/` +payload.customerID),
        {
          name: payload.name,
          description: payload.description,
          email: payload.email,
          phone: payload.phone,
        })
        .then(() => {
          console.log("Update")
        })
    },


  },
})
