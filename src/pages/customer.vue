<script setup>
import {DataDB} from '@/stores/dataDB'
import {v4 as uuidv4} from 'uuid'
const dataBase = DataDB()

onMounted( async () => {
  await allTask()
})

const rulesUser = ref({
  emailRules: [
    v => !!v || "Пошта обов'язкова",
    v => /.+@.+/.test(v) || 'Некоректний запис пошти',
  ],
})

const newCategory = ref({
  categoryId: '',
  name: '',
})

const sortByColumn = ref('')
const sortDirection = ref('asc')

const admit = ref(false)
const customer = ref({
  name:'',
  email:'',
  phone:'',
  description:'',
  customerID:'',
})

const showCustomerFields = ref(false)

const addCustomer = ref(false)

const editCust = ref(false)

const tasks = ref([])

const customers = ref([])

const addDiolog = ref(false)

const updateDiolog = ref(false)

const categories = ref([])

function addTask(){
  addDiolog.value = true
}
const task = ref({
  uuid : '',
  name:'',
  description:'',
  date:'',
  Ldate:'',
  clietn_id:'',
  client_name:'',
  maket_link:'',
  category_id:'',
  category_name:'',
  status: false,
})
const info = ref(false)
const selectedItem = ref()

async function allTask() {
  try {

    customers.value = Object.values(await dataBase.fetchCustomers())
 
    categories.value = Object.values (await dataBase.fetchCategory())

    tasks.value = Object.values(categories.value)
      .flatMap(obj => obj.User_Task ? Object.values(obj.User_Task) : [])

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

function getCustomerName(customerId) {
  const id = customers.value.find(customer => customer.customerId === customerId)

  return id ? id.name : ''
}

function udateTask(item){
  console.log(item)
  updateDiolog.value = true
  task.value.name = item.name
  task.value.description= item.description
  task.value.clietn_id= item.clietn_id
  customer.value.name = getCustomerName(item.clietn_id)
  task.value.maket_link = item.maket_link
  task.value.Ldate = item.date_do
  task.value. uuid = item.taskId
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

function cancelAddTask(){
  addDiolog.value = false
  task.value.name = ''
  task.value.description= ''
  task.value.clietn_id= ''
  task.value.maket_link = ''
  task.value.Ldate = ''
  task.value.category_name = ''
  task.value.category_id = ''

  customer.value.name = ''
  customer.value.phone = ''
  customer.value.email = ''
  customer.value.description = ''
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

function getCurrentDateTime() {
  const currentDate = new Date()

  const day = String(currentDate.getDate()).padStart(2, '0')
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const year = currentDate.getFullYear()


  return `${day}.${month}.${year}`
}
async function deleteTask(){
  console.log(selectedItem.value)
  await dataBase.removeTask(selectedItem.value)
  await allTask()
}
async function createTask() {
  task.value.date = getCurrentDateTime()
  task.value.uuid = uuidv4()
  task.value.client_name = customer.value.name
  console.log(task.value)

  if (findCategoryIdByCategoryName(task.value.category_name) === null){

    newCategory.value.name = task.value.category_name
    newCategory.value.categoryId = uuidv4()
    task.value.category_id = newCategory.value.categoryId

    console.log(newCategory.value)

    console.log(task.value)
    console.log('НЕЕЕЕ')
    
    await dataBase.addCategory(newCategory.value)

    await dataBase.addTask(task.value)

    cancelAddTask()

    await allTask()
    newCategory.value.name = ''
    newCategory.value.categoryId = ''

  }else {
    task.value.category_id = findCategoryIdByCategoryName(task.value.category_name)
    console.log("ДААААА")
    console.log(newCategory.value)
    console.log(task.value)

    await dataBase.addTask(task.value)

    cancelAddTask()

    await allTask()
  }
}

function findCategoryIdByCategoryName(categoryName) {
  const foundCategory = categories.value.find(category => category.name === categoryName)

  return foundCategory ? foundCategory.categoryId : null
}

function clancelTask(){
  updateDiolog.value = false
  cancelAddTask()
}

async function editTask(){
  customer.value.customerID = uuidv4()
  if (Object.values(customer.value).some(value => value === '')) {
    console.log('lox')
    console.log(customer.value)
    await dataBase.updateTask(task.value)
    cancelAddTask()
  } else {
    console.log('ne lox')
    task.value.clietn_id = customer.value.customerID

    await dataBase.updateTask(task.value)
    await dataBase.addСustomer(customer.value)
    cancelAddTask()
  }


  await allTask()
  updateDiolog.value = false
  cancelAddTask()
}

function  handleCustomerSelection(name) {
  console.log(customers.value)
  console.log(name)
  if(customers.value === null ){
    showCustomerFields.value = true
  } else {
    const foundCustomer = customers.value.find(customer => customer.name === name)
    console.log(foundCustomer)
    if (foundCustomer) {
      console.log(foundCustomer.customerId)
      task.value.clietn_id = foundCustomer.customerId
      showCustomerFields.value = false
    } else {
      showCustomerFields.value = true
    }
  }
}

function getName(customerId){

  if (customers.value.find(customer => customer.customerId === customerId)){
    const id = customers.value.find(customer => customer.customerId === customerId)
    customer.value.name = id.name
  } else {
    customer.value.name = ''
  }
  console.log(selectedItem.value)
}

function getTasksForCustomer(customerId) {

  return tasks.value.filter(task => task.clietn_id === customerId)
}

function sortedData(){
  if (sortByColumn.value) {
    tasks.value.sort((a, b) => {
      const modifier =  sortDirection.value === 'asc' ? 1 : -1
      if (a[sortByColumn.value] < b[sortByColumn.value]) return -1 * modifier
      if (a[sortByColumn.value] > b[sortByColumn.value]) return 1 * modifier

      return 0
    })
  }

  return  tasks.value
}

function sortBy(column) {
  console.log(column)
  if (column === sortByColumn.value) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortByColumn.value = column
    sortDirection.value = 'asc'
  }
  sortedData()
}
</script>


<template>
  <VRow justify="center">
    <VDialog
      v-model="info"
      persistent
      width="1024"
    >
      <VCard>
        <VCardTitle style="margin-left: 1%; margin-top: 2%">
          <VTextField
            v-model="selectedItem.name"
            class="custom-text-field"
            label="Назва замовлення"
            required
            variant="underlined"
            readonly
          />
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="selectedItem.category_name"
                  label="Категорія"
                  required
                  variant="underlined"
                  readonly
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="selectedItem.date_do"
                  label="Дата завершення"
                  required
                  type="date"
                  variant="underlined"
                  readonly
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="selectedItem.description"
                  label="Опис замовлення"
                  maxlength="1000"
                  variant="underlined"
                  auto-grow
                  rows="1"
                  row-height="15"
                  readonly
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="selectedItem.maket_link"
                  label="Посилання на макет проекту"
                  required
                  type="url"
                  variant="underlined"
                  readonly
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
            @click="info = false; customer.name = ''"
          >
            Закрити
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
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
                    :rules="rulesUser.emailRules"
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
          xl="4"
          lg="6"
          sm="12"
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
                      <th @click="sortBy('name')">
                        Назва
                      </th>
                      <th @click="sortBy('date_do')">
                        Дата виконання
                      </th>
                      <th @click="sortBy('status')">
                        Стан
                      </th>
                      <th>
                        <VBtn
                          icon="mdi-plus"
                          size="x-small"
                          @click="customer.name = item.name; task.clietn_id = item.customerId; addTask()"
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(task, taskIndex) in getTasksForCustomer(item.customerId)"
                      :key="taskIndex"
                      @click="info = true; selectedItem = task; getName(item.clietn_id)"
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
                      <td>
                        <VBtn
                          icon="mdi-pencil"
                          size="x-small"
                          style="margin-right: 2%"
                          @click.stop="udateTask(task)"
                        />
                        <VBtn
                          style="margin-right: 2%"
                          icon="mdi-trash-can"
                          size="x-small"
                          @click.stop="admit = true; selectedItem = task"
                        />
                      </td>
                    </tr>
                  </tbody>
                </VTable>
              </VContainer>
            </VCard>
          </VHover>
        </VCol>
      </template>
      <VCol
        cols="12"
        md="2"
        sm="6"
        xs="12"
        @click="addCustomer = true; editCust = true"
      >
        <VHover v-slot="{ isHovering, props }">
          <VCard
            :elevation="isHovering ? 12 : 2"
            :class="{ 'on-hover': isHovering }"
            v-bind="props"
          >
            <div>
              <VIcon
                icon="mdi-plus"
                size="50%"
                style="margin-left: 25%"
              />
            </div>
            <div class="text-center flex-grow-1 text-h6 d-flex flex-column">
              <p> Додати <br> клієнта</p>
            </div>
          </VCard>
        </VHover>
      </VCol>
    </VRow>
  </VContainer>


  <VRow justify="center">
    <VDialog
      v-model="addDiolog"
      persistent
      width="1024"
    >
      <VCard>
        <VCardTitle style="margin-left: 1%; margin-top: 2%">
          <VTextField
            v-model="task.name"
            class="custom-text-field"
            label="Назва замовлення"
            required
            variant="underlined"
          />
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VCombobox
                  v-model="task.category_name"
                  :items="categories"
                  item-value="categoryId"
                  item-title="name"
                  label="Категорія"
                  required
                  variant="underlined"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="task.Ldate"
                  label="Дата завершення"
                  required
                  type="date"
                  variant="underlined"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="task.description"
                  label="Опис замовлення"
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
                  v-model="task.maket_link"
                  label="Посилання на макет проекту"
                  required
                  type="url"
                  variant="underlined"
                />
              </VCol>
              <VCol cols="12">
                <VTextField
                  v-model="customer.name"
                  label="Ім'я замовника"
                  required
                  variant="underlined"
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
        <VCardTitle style="margin-left: 1%; margin-top: 2%">
          <VTextField
            v-model="task.name"
            class="custom-text-field"
            label="Назва замовлення"
            required
            variant="underlined"
          />
        </VCardTitle>
        <VCardText>
          <VContainer>
            <VRow>
              <VCol cols="12">
                <VTextField
                  v-model="task.Ldate"
                  label="Дата завершення"
                  required
                  type="date"
                  variant="underlined"
                />
              </VCol>

              <VCol cols="12">
                <VTextarea
                  v-model="task.description"
                  label="Опис замовлення"
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
                  v-model="task.maket_link"
                  label="Посилання на макет проекту"
                  required
                  type="url"
                  variant="underlined"
                />
              </VCol>
              <VCol cols="12">
                <VCombobox
                  v-model="customer.name"
                  :items="customers"
                  item-value="customerId"
                  item-title="name"
                  label="Ім'я замовника"
                  variant="underlined"
                  @blur="handleCustomerSelection(customer.name)"
                />
              </VCol>
              <VCol
                v-if="showCustomerFields"
                cols="12"
              >
                <!-- Дополнительные поля для ввода данных заказчика -->
                <!-- Например: -->

                <VCol cols="12">
                  <VTextField
                    v-model="customer.phone"
                    label="Телефон замовника"
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
                    v-model="customer.email"
                    label="Email замовника"
                    required
                    variant="underlined"
                    :rules="rulesUser.emailRules"
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
            @click="clancelTask"
          >
            Закрити
          </VBtn>
          <VBtn
            color="blue-darken-1"
            variant="text"
            @click="editTask"
          >
            Змінити
          </VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VRow>



  <VDialog
    v-model="admit"
    max-width="290"
  >
    <VCard>
      <VCardTitle>
        Підтвердіть видалення
      </VCardTitle>
      <VCardText>
        Ви впевнені  що хочете видалити завдання?
      </VCardText>

      <VCardActions>
        <VBtn
          color="green darken-1"
          text
          @click="admit = false"
        >
          Ні
        </VBtn>

        <VBtn
          color="green darken-1"
          text
          @click="deleteTask(); admit = false"
        >
          Так
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>


