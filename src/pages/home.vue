<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { computed } from 'vue-demi'
import moment from 'moment'
import router from '../router'
const eduProgsStore = useEduProgsStore()



onMounted( async () => {

})

let currentEduProg = null
let newNameEduProg = ref(null)
const eduProgs = computed(() => eduProgsStore.getEduProgs)


const deleteEduProg =( async id => {
  await eduProgsStore.deleteEduProg(id)
  await eduProgsStore.fetchEduProgs()
})
const editNameEduProg =( async() => {
  currentEduProg.name = newNameEduProg.value
  await eduProgsStore.editNameEduProg(currentEduProg, currentEduProg.id)
  newNameEduProg.value=null
  dialogRename.value=false
})
const createEduProg =( async() => {
  await eduProgsStore.createEduProg(newEduProg.value)
  dialogCreate.value=false
  await eduProgsStore.fetchEduProgs()
})

// const createEduProg =( async() => {
//   console.log(newEduProg)
//   await eduProgsStore.createEduProg(newEduProg)
// })

// const props = defineProps({
//   modelValue: {
//     type: [Boolean],
//     default: false
//   }
// })
// const emit = defineEmits(['update:modelValue'])
// let dialog = computed({
//   get () {
//     return props.modelValue
//   },
//   set (value) {
//     return emit('update:modelValue', value)
//   }
// })


const dialogCreate = ref(false)
const dialogRename = ref(false)
const dialogDelete = ref(false)
const createEduProgDialog = function dialogg() {
  dialogCreate.value=true
}
const renameEduProgDialog = function dialogg(id) {
  dialogRename.value=true
  currentEduProg = id
}
const deleteEduProgDialog= function dialogg(id) {
  dialogDelete.value=true
  currentEduProg = id
}
const editEduProg = function edit(event, id) {
  console.log(event)
  router.replace('/eduprogs/'+id)
}


const newEduProg = ref({
  name :'',
  education_level :'',
  stage :'',
  speciality :'',
  knowledge_field :'',
})
</script>

<template>
  <VCardText>
    <VBtn
      dark
      @click="createEduProgDialog"
    >
      Створити ОПП
    </VBtn>
  </VCardText>


  <VDialog
    v-model="dialogCreate"
    persistent
    max-width="600px"
  >
    <VCard>
      <VCardTitle>
        <span class="text-h5">Створення нової ОПП</span>
      </VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newEduProg.name"
                label="Назва документу "
                required
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newEduProg.education_level"
                label="Освітній рівень"
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newEduProg.stage"
                label="Освітній ступінь"
                required
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newEduProg.speciality"
                label="Спеціальність"
                required
              />
            </VCol>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newEduProg.knowledge_field"
                label="Галузь знань"
                required
              />
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VSpacer />
        <VBtn
          color="blue darken-1"
          text
          @click="dialogCreate = false"
        >
          Закрити
        </VBtn>
        <VBtn
          text
          :disabled="!(newEduProg.knowledge_field && newEduProg.speciality && newEduProg.name &&newEduProg.education_level && newEduProg.stage)"
          @click="createEduProg"
        >
          <!-- Need fix, user need to reload page for check new EduProg -->
          Створити
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>


  <VTable v-if="eduProgs.length>0">
    <thead>
      <tr>
        <th class="text-uppercase">
          Назва
        </th>
        <th class="text-center text-uppercase">
          Спеціальність
        </th>
        <th class="text-center text-uppercase">
          Рівень знань
        </th>
        <th class="text-center text-uppercase">
          Дата редагування
        </th>
        <th class="text-center text-uppercase" />
      </tr>
    </thead>
    <tbody>
      <tr 
        class="eduprog-item"
        v-for="item in eduProgs"
        :key="item.id"
        @click="editEduProg($event, item.id)"
      >
        <td>{{ item.name }}</td>
        <td class="text-center">
          {{ item.speciality }}
        </td>
        <td class="text-center">
          {{ item.education_level }}
        </td>
        <td class="text-center">
          {{ moment(item.updated_date).format('DD.MM.YYYY HH:mm:ss') }}
        </td>
        <td class="text-center">
          <VBtn
            icon="mdi-pencil"
            size="x-small"
            style="margin-right:2% "
            @click.stop="renameEduProgDialog(item)"
          />

          <VBtn
            icon="mdi-trash-can"
            size="x-small"
            @click.stop="deleteEduProgDialog(item)"
          />
        </td>
      </tr>
    </tbody>
  </VTable>
  <VAlert
    v-else
    border="left"
    text
    type="info"
    prominent
  >
    Поки що не створено жодної освітньо-професійної програми.
  </VAlert>
  <VDialog
    v-model="dialogRename"
    persistent
    max-width="600"
  >
    <VCard>
      <VCardTitle>Перейменувати ОПП</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              cols="12"
            >
              <VTextField
                v-model="newNameEduProg"
                label="Введіть нову назву ОПП"
                required
              />
            </VCol>
          </VRow>
        </VContainer>

        <VCardActions>
          <VSpacer />
          <VBtn
            text
            @click="dialogRename = false"
          >
            Відмінити
          </VBtn>
          <VBtn
            text
            @click="editNameEduProg(); 
            dialogRename = false"
          >
            Зберегти
          </VBtn>
        </VCardActions>
      </VCardText>
    </VCard>
  </VDialog>


  <VDialog
    v-model="dialogDelete"
    max-width="290"
  >
    <VCard>
      <VCardTitle>
        Підтвердіть видалення
      </VCardTitle>
      <VCardText>
        Ви впевнені  що хочете видалити ОПП: {{ currentEduProg.name }}?
      </VCardText>

      <VCardActions>
        <VBtn
          color="green darken-1"
          text
          @click="dialogDelete = false"
        >
          Ні
        </VBtn>

        <VBtn
          color="green darken-1"
          text
          @click="deleteEduProg(currentEduProg.id); dialogDelete = false"
        >
          Так
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<route lang="yaml">
meta:
  requiresAuth: true
</route>
