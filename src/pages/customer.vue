<script setup>
import {DataDB} from '@/stores/dataDB'
import {v4 as uuidv4} from 'uuid'
const dataBase = DataDB()

onMounted( async () => {
  await allTask()
})

const customer = ref({
  name:'',
  email:'',
  phone:'',
  description:'',
  customerID:'',
})

const addCustomer = ref(false)
const editCust = ref(false)

const tasks = ref([])
const customers = ref([])

async function allTask() {
  try {
    tasks.value = Object.values (await dataBase.fetchTasks())
    console.log(tasks.value)
    customers.value = Object.values(await dataBase.fetchCustomers())
    console.log(customers.value)

  } catch (error) {
    console.error(error)

  }
}

async function deleteCustomer(item){
  await dataBase.removeCustomer(item)
  await allTask()
}

async function updateStatus(item){
  await dataBase.updateStatus(item)
}

function getTasksForCustomer(customerId) {

  return tasks.value.filter(task => task.clietn_id === customerId)
}
function clancel(){
  addCustomer.value = false
  editCust.value  = false
  customer.value.name = ''
  customer.value.description = ''
  customer.value.email = ''
  customer.value.phone = ''
  customer.value.customerID = ''
}

function editCustomer(item){
  console.log(item)
  editCust.value = true
  customer.value.name = item.name
  customer.value.description = item.description
  customer.value.email = item.email
  customer.value.phone = item.phone
  customer.value.customerID = item.customerId
}

async function edit(){
  console.log(customer.value)
  await dataBase.updateCustomer(customer.value)
  clancel()
  await allTask()
}

async function addCust(){
  customer.value.customerID = uuidv4()
  await dataBase.addСustomer(customer.value)
  clancel()
  await allTask()
}
</script>


<template>
  <VRow>
    <VCol cols="2">
      <VBtn
        dark
        class="mb-3"
        @click="addCustomer = true; editCust = true"
      >
        Додати клієнта
      </VBtn>
    </VCol>
  </VRow>



  <VRow justify="center">
    <VDialog
      v-model="editCust"
      persistent
      width="1024"
    >
      <VCard>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VCol cols="12">
                  <VTextField
                    v-model="customer.name"
                    label="Ім'я замовника"
                    required
                    variant="underlined"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextarea
                    v-model="customer.description"
                    label="Про замовника"
                    maxlength="1000"
                    variant="underlined"
                    clearable
                    auto-grow
                    rows="1"
                    row-height="15"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="customer.phone"
                    label="Телефон замовника"
                    required
                    variant="underlined"
                  />
                </VCol>
                <VCol cols="12">
                  <VTextField
                    v-model="customer.email"
                    label="Email замовника"
                    required
                    variant="underlined"
                  />
                </VCol>
              </VCol>
            </VRow>
          </VContainer>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="clancel"
          >
            Закрити
          </VBtn>


          <template v-if="addCustomer">
            <VBtn
              color="blue-darken-1"
              variant="text"
              @click="addCust"
            >
              Додати
            </VBtn>
          </template>
          <template v-else>
            <VBtn
              color="blue-darken-1"
              variant="text"
              @click="edit"
            >
              Змінити
            </VBtn>
          </template>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>



  <VContainer class="pa-4 ">
    <VRow
      class="fill-height"
      align="center"
      justify="center"
    >
      <template
        v-for="(item, index) in customers"
        :key="index"
      >
        <VCol
          cols="12"
          md="4"
        >
          <VHover v-slot="{ isHovering, props }">
            <VCard
              :elevation="isHovering ? 12 : 2"
              :class="{ 'on-hover': isHovering }"
              v-bind="props"
            >
              <VCardTitle class="text-h6 d-flex flex-column">
                <div class="d-flex justify-space-between">
                  <div class="text-center flex-grow-1">
                    <p class="mt-4">
                      {{ item.name }}
                    </p>
                  </div>
                  <VMenu>
                    <template #activator="{ props }">
                      <VBtn
                        icon="mdi-dots-horizontal"
                        size="x-small"
                        v-bind="props"
                      />
                    </template>

                    <VList>
                      <VListItem @click="editCustomer(item)">
                        <VListItemTitle>Редагувати</VListItemTitle>
                      </VListItem>
                      <VListItem @click="deleteCustomer(item)">
                        <VListItemTitle>Видалити</VListItemTitle>
                      </VListItem>
                    </VList>
                  </VMenu>
                </div>
                <div>
                  <p class="ma-0 text-body-4 font-weight-bold ">
                    Контактні данні:
                  </p>
                  <p class="ma-0 text-body-1 font-weight-bold">
                    Телефон: {{ item.phone }}
                  </p>
                  <p class="ma-0 text-body-1 font-weight-bold">
                    Email: {{ item.email }}
                  </p>
                  <p class="ma-0 text-body-4 font-weight-bold ">
                    Додаткові данні:
                  </p>
                  <p class="text-caption font-weight-medium">
                    {{ item.description }}
                  </p>
                </div>
              </VCardTitle>
              <VContainer>
                <VTable>
                  <thead>
                    <tr>
                      <th>Назва</th>
                      <th>Дата виконання</th>
                      <th>Стан</th>
                      <th />
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(task, taskIndex) in getTasksForCustomer(item.customerId)"
                      :key="taskIndex"
                    >
                      <td>{{ task.name }}</td>
                      <td>{{ task.date_do }}</td>
                      <td style="text-align: center">
                        <template v-if="task.status">
                          <VCheckbox
                            v-model="task.status"
                            color="success"
                            hide-details
                            @change="updateStatus(task)"
                            @click.stop
                          >
                            Виконано
                          </VCheckbox>
                        </template>
                        <template v-else>
                          <VCheckbox
                            v-model="task.status"
                            style="color: red"
                            color="error"
                            hide-details
                            @change="updateStatus(task)"
                            @click.stop
                          >
                            Не виконано
                          </VCheckbox>
                        </template>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </VTable>
              </VContainer>
            </VCard>
          </VHover>
        </VCol>
      </template>
    </VRow>
  </VContainer>
</template>


