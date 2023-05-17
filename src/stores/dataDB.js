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
      await set(ref(db, `/${auth.currentUser.uid}/User_Task/` + payload.uuid),
        {
          name: payload.name,
          taskId : payload.uuid,
          description: payload.description,
          date: payload.date,
          clietn_id: payload.clietn_id,
          maket_link: payload.maket_link,
          status: false,
        })
        .then(() => {
          console.log("Gotovo")
        })
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

    async updateTask(payload){
      await update(ref(db, `/${auth.currentUser.uid}/User_Task/` + payload.uuid),
        {
          name: payload.name,
        })
        .then(() => {
          console.log("Update")
        })

    },

    async removeTask(payload){
      await remove(ref(db, `/${auth.currentUser.uid}/User_Task/` + payload.uuid))
        .then(() => {
          console.log("Delete")
        })

    },


  },
})
