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
const updateDiolog = ref(false)
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
  await allTask()
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

function udateTask(item){
  console.log(item)
  updateDiolog.value = true
}

async function editTask() {
  updateDiolog.value = false
  await dataBase.updateTask(item)
}

async function deleteTask(item){
  console.log(item)
  await dataBase.removeTask(item)
  await allTask()
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


  <VRow justify="center">
    <VDialog
      v-model="updateDiolog"
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
            @click="editTask"
          >
            Оновити
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>



  <VBtn
    dark
    class="mb-3"
    @click="addTask"
  >
    Додати замовлення
  </VBtn>

  <VRow>
    <VCol>
      <VTable>
        <thead>
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
            <th />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in tasks"
            :key="index"
          >
            <td style="text-align: center">
              <span> {{ item.name }}</span>
            </td>
            <td style="text-align: center">
              <span>{{ item.date }}</span>
            </td>
            <td style="text-align: center">
              <span> {{ item.clietn_id }} </span>
            </td>
            <td style="text-align: center">
              <span>{{ item.status }}</span>
            </td>
            <td>
              <VBtn
                icon="mdi-pencil"
                size="x-small"
                style="margin-right: 2%"
                @click.stop="udateTask(item)"
              />
              <VBtn
                style="margin-right: 2%"
                icon="mdi-trash-can"
                size="x-small"
                @click.stop="deleteTask(item)"
              />
            </td>
          </tr>
        </tbody>
      </VTable>
    </VCol>
  </VRow>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>


https://github.com/KAZAHv2/Diplom-vue3
https://diplom-5ae23.web.app/
