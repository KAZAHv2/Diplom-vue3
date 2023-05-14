<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { getData } from '@/api/http/apiService'
const eduProgsStore = useEduProgsStore()

const ZKCompetencies = ref([])
 console.log(ZKCompetencies)
const selectedCompetencies = eduProgsStore.getSelectedCompetencies
onBeforeMount(async () => {
  await eduProgsStore.fetchCompetencies(route.params.id)
  ZKCompetencies.value=eduProgsStore.getZKCompetencies
  console.log(ZKCompetencies)
})

</script>

<template>
    <VTable>
    <thead class="thead-light">
      <tr>
        <th class="text-center">Загальні компетентності</th>
      </tr>
    </thead>
  </VTable>
  <VTable>
    <thead class="thead-light">
      <tr>
        <th>Код</th>
        <th>Опис</th>
        <th>Обрано</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in eduProgsStore.getZKCompetencies"
        :key="item.id"
      >
        <td style="white-space:nowrap">{{ item.type+" "+item.id }}</td>
        <td class="py-4">
          {{ item.definition }}
        </td>
        <td rowspan="1">
        <VRow justify="center">
         <VCheckbox
              v-model="competencies[item.competency_id]"
              @update:modelValue="changeCheckbox($event,item.competency_id)"
            />
        </VRow>
        </td>
      </tr>
    </tbody>
  </VTable>
</template>