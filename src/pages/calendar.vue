<template>
  <VueCal
    class="vuecal--blue-theme"
    :disable-views="['years']"
    :events="event"
    locale="uk"
    :time="false"
    active-view="month"
    :events-on-month-view="[ 'short'][shortEventsOnMonthView * 1]"
  />
</template>

<script setup>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import {DataDB} from '@/stores/dataDB'
const dataBase = DataDB()
const showAllDayEvents = ref(0)
const shortEventsOnMonthView = ref( false)
onMounted( async () => {
  await allTask()
  sortArr()
})

const categories = ref([])
const tasks = ref([])
const event = ref([])

const customers = ref([])

async function allTask() {
  try {
    categories.value = Object.values (await dataBase.fetchCategory())

    tasks.value = Object.values(categories.value)
      .flatMap(obj => obj.User_Task ? Object.values(obj.User_Task) : [])

    customers.value = Object.values(await dataBase.fetchCustomers())


  } catch (error) {
    console.error(error)

  }
}

function sortArr(){
  event.value = tasks.value.map(function(oldObj) {


    return {
      start: oldObj.date_do,
      end: oldObj.date_do,
      title: oldObj.name,
      content: oldObj.description,
      id: oldObj.taskId,
    }
  })
}
</script>

<style>
.vuecal__menu, .vuecal__cell-events-count {background-color: #9155FD !important;}
.vuecal__title-bar {background-color: #b696fc !important;}
.vuecal__cell--today, .vuecal__cell--current {background-color: #e9e7ea !important;}
.vuecal:not(.vuecal--day-view) .vuecal__cell--selected {background-color: #ccbcf8 !important;}
.vuecal__cell--selected:before {border-color: #ccbcf8 !important;}
.vuecal__event-title{ font-size: 20px; font-weight: bold; margin-top: 2%}
.vuecal__event-content {margin-bottom: 2%}
.vuecal__event {
  border-width: 1px;
  outline: 2px solid #000;
  margin-top: 2%;
  border-radius: 20px;
  width: 90%;
}
.vuecal__cell-events{
  margin-left: 5%;
}
.vuecal__event-title{
  justify-content: center;
  display: flex;
}
.vuecal__cell-date{
  font-size: 20px;
}

.vuecal {height: 90vh;}
</style>
