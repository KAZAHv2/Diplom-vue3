<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const eduProgsStore = useEduProgsStore()
const components = eduProgsStore.getEduProg.components
const loading = ref(false)
const mandatoryComponents = reactive(
  components.mandatory.map(component => ({
    ...component,
    items: [], // добавляем пустой массив items для каждого компонента
  })),
)
const allComponents = ref(components.mandatory)
const sortedComponents = component => {
  return components.mandatory.filter(el => {
    return el.id !== component.id
  })
}
const selectedComponents = reactive({})
const selectedComponentsInDB =ref({})
const possibleComponents = reactive({})
onBeforeMount(async () => {
  loading.value = true
  await components.mandatory.forEach(el => {
    selectedComponents[el.id]=[]
    eduProgsStore.fetchPossibleRelations(el.eduprog_id, el.id).then(res => {
      possibleComponents[el.id] = res
    })
  })
  await eduProgsStore.fetchRelations(route.params.id).then(res => {
    console.log(selectedComponents)
    Object.keys(selectedComponents).forEach((componentId) =>{
      selectedComponents[componentId]=res.filter(el => el.base_comp_id == componentId)
      selectedComponents[componentId].forEach(el =>{
      el.id = el.child_comp_id
    })
    })
  })
  selectedComponentsInDB.value = {...selectedComponents}
  console.log("Селектед", selectedComponents)
  loading.value = false
})

const activeCombobox= reactive({})
const handleChanges = (e, component) =>{
  console.log("Ивент", e)
  console.log("Компонент", component)
  activeCombobox.base_comp_id = component.id
  activeCombobox.child_comp_id = e
}
const closeCombobox = async () =>{
  if(activeCombobox.base_comp_id){
  const inDb = selectedComponentsInDB.value[activeCombobox.base_comp_id]
  const onSite = selectedComponents[activeCombobox.base_comp_id]
  const forDelete = []
  const forAdd = []
  console.log("На сайте", selectedComponents[activeCombobox.base_comp_id])
  console.log("В БД", selectedComponentsInDB.value[activeCombobox.base_comp_id])
  inDb.forEach(element => {
  console.log(element.id)
  if (!onSite.find(e => e.id=== element.id)){
    forDelete.push(element)
  }
  })
  onSite.forEach(element => {
  console.log(element.id)
  if (!inDb.find(e => e.id=== element.id)){
    forAdd.push(element)
  }
  })
  forAdd.forEach((el)=>{
    const newRelation = {
      eduprog_id:+route.params.id,
      base_comp_id: activeCombobox.base_comp_id,
      child_comp_id: el.id
    }
    eduProgsStore.createRelation(newRelation)
    
  })
  forDelete.forEach((el)=>{
    eduProgsStore.deleteRelation(el.base_comp_id, el.child_comp_id)
  })
  console.log("На удаление", forDelete)
  console.log("На добавление", forAdd)
  activeCombobox.base_comp_id = null
  activeCombobox.child_comp_id = null
  }
}
</script>

<template>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">Назва документу</th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th>Код н/д</th>
        <th>Назва КОП</th>
        <th>Залежності</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="component in components.mandatory"
        :key="component.id"
      >
        <td>{{ 'ОК ' + component.code }}</td>
        <td>
          <span>{{ component.name }}</span>
        </td>
        <td rowspan="1">
          <VCombobox
            v-if="possibleComponents[component.id]?.length"
            v-model="selectedComponents[component.id]"
            :items="possibleComponents[component.id]"
            item-title="name"
            item-value="id"
            multiple
            chips
            class="ma-0, my-4"
            style="width: 100%"
            @update:modelValue="handleChanges($event, component)"
            @blur="closeCombobox"
          />
          <v-alert
            v-else
            type="info"
            text="Вибачте, але щоб тут зявилися можливі звязки, потрібно спочатку заповнити сторінку розподілу по семестрам"
            variant="tonal"
            class="my-4"
          ></v-alert>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>
