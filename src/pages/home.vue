<script setup>
import { auth, db, useUserStore } from '@/stores/user'
import {DataDB} from '@/stores/dataDB'
import {v4 as uuidv4} from 'uuid'
const dataBase = DataDB()
const tasks = ref({})
onMounted( async () => {
  await allTask()
})

// read

// add


// update

// delete

// firebase.ref()
// firebase.set()

const addDiolog = ref(false)
const task = ref({
  uuid : '',
  name:'',
  description:'',
  date:'',
  clietn_id:'',
  maket_link:'',
  status: false,
})


function getCurrentDateTime() {
  const currentDate = new Date()

  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()
  const hours = String(currentDate.getHours()).padStart(2, '0')
  const minutes = String(currentDate.getMinutes()).padStart(2, '0')
  const seconds = String(currentDate.getSeconds()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`
}

function addTask(){
  addDiolog.value = true
}
async function createTask() {
  task.value.date = getCurrentDateTime()
  task.value.uuid = uuidv4()
  console.log(task.value)
  await dataBase.addTask(task.value)
  cancelAddTask()
}
function cancelAddTask(){
  addDiolog.value = false
  task.value.name = ''
  task.value.description= ''
  task.value.clietn_id= ''
  task.value.maket_link = ''
}

async function allTask() {
  try {
    tasks.value = await dataBase.fetchTasks()
    console.log(tasks.value)

  } catch (error) {
    console.error(error)

  }
}

async function udateTask(){
  await dataBase.updateTask(tasks.value)
}

async function deleteTask(){
  await dataBase.removeTask(tasks.value)
}
</script>

<template>
  <VRow justify="center">
    <VDialog
      v-model="addDiolog"
      persistent
      width="1024"
    >
      <VCard>
        <VCardTitle>
          <span class="text-h5">Замовлення</span>
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol
                cols="12"
              >
                <VTextField
                  v-model="task.name"
                  label="Назва замовлення*"
                  required
                />
              </VCol>

              <VCol cols="12">
                <VTextField
                  v-model="task.clietn_id"
                  label="Замовник*"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="task.description"
                  label="Опис замовлення*"
                  required
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="task.maket_link"
                  label="Посилання на макет*"
                  required
                />
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="cancelAddTask"
          >
            Закрити
          </VBtn>
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="createTask"
          >
            Створити
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>


  <VRow>
    <VCol>
      <VTable>
        <thead>
          <tr>
            <th
              style="text-align: center;  align-items: center;"
              colspan="4"
            >
              <p style=" font-size: medium; margin-top: 1%">
                Замовлення
              </p>

              <VBtn
                icon="mdi-plus"
                size="x-small"
                @click=" addTask"
              />
            </th>
          </tr>
          <tr>
            <th colspan="4">
              <hr style="min-height: 1px; width: 100%">
            </th>
          </tr>
          <tr>
            <th style="text-align: center">
              Назва замовлення
            </th>
            <th style="text-align: center">
              Дата замовлення
            </th>
            <th style="text-align: center">
              Замовник
            </th>
            <th style="text-align: center">
              Cтан замовлення
            </th>
          </tr>
        </thead>
      </VTable>
      <VCol
        v-for="(item, index) in tasks"
        :key="index"
      >
        <VCard>
          <details style="margin-left: 1%">
            <summary>
<VTable>

  <tbody>

<tr>
  <td style="text-align: center"> <span> {{item.name}}</span></td>
  <td style="text-align: center"> <span>{{item.date}}</span></td>
  <td > <span> {{item.clietn_id }} </span></td>
  <td >  <span>{{item.status}}</span></td>
</tr>

  </tbody>

</VTable>
            </summary>
            Опис замовлення:
            <span>{{item.description }}</span> <br>
            Посилання на макет:
            <span>{{item.maket_link}}</span>
          </details>
        </VCard>
      </VCol>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
