import { deleteData, editData, getData, postData } from '@/api/http/apiService';
import { defineStore } from 'pinia';
export const useEduProgsStore = defineStore({
  id: 'eduProgs',

  state: () => ({
    eduProgs:[],
  }),

  getters: {
    getEduProgs: state => state.eduProgs,
  },

  actions: {
    async fetchEduProgs(){
        const response = await getData('eduprogs');
        this.eduProgs = response.items;
    },
    async deleteEduProg(payload){
        await deleteData('/eduprogs/'+payload);
        this.fetchEduProgs
    },
    async createEduProg(payload){
      await postData('/eduprogs/create', payload);
      this.fetchEduProgs
    },
    async editNameEduProg(payload, id){
    await editData('/eduprogs/'+ id, payload);
    this.fetchEduProgs
    },
  },
})
