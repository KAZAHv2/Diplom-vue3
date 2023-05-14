<script setup>
import { useRoute } from 'vue-router'
import EditDocumentCharacteristic from '@/views/pages/edit-document/EditDocumentCharacteristic.vue'
import EditDocumentComponents from '@/views/pages/edit-document/EditDocumentComponents.vue'
import EditDocumentSchema from '@/views/pages/edit-document/EditDocumentSchema.vue'
import EditDocumentSequence from '@/views/pages/edit-document/EditDocumentSequence.vue'
import EditDocumentMatrix from '@/views/pages/edit-document/EditDocumentMatrix.vue'
import EditDocumentZK from '@/views/pages/edit-document/EditDocumentZK.vue'

import { useEduProgsStore } from '@/stores/eduProgs.js'
import axios from 'axios'
const eduProgsStore = useEduProgsStore()
const route = useRoute()
const activeTab = ref(route.params.tab)
onMounted(async () => {
  await eduProgsStore.findEduProgById(route.params.id)
  await eduProgsStore.fetchScheme(route.params.id)
})
const exportToExcel = () =>{
  eduProgsStore.exportToExcel(route.params.id)
}
// tabs
const tabs = [
  {
    title: 'Загальна Характеристика',
    icon: 'mdi-format-list-bulleted',
    tab: 'characteristic',
  },
  {
    title: 'Перелік компонентів',
    icon: 'mdi-sort-variant',
    tab: 'components',
  },
  {
    title: 'Розподіл по семестрам',
    icon: 'mdi-table',
    tab: 'sequence',
  },
  {
    title: 'Структурно-логічна послідовність ОПП',
    icon: 'mdi-format-line-style',
    tab: 'schema',
  },
  {
    title: 'Вибір компотентностей',
    icon: 'mdi-archive-check-outline',
    tab: 'compZK',
  },
  {
    title: 'Матриця відповідностей',
    icon: 'mdi-matrix',
    tab: 'matrix',
  },
]
</script>

<template>
  <VRow
    justify="start"
    class="mb-3"
  >
    <VBtn
      dark
      @click="exportToExcel"
    >
      Експортувати
    </VBtn>
  </VRow>
  <div v-if="!eduProgsStore.isLoading && eduProgsStore.getEduProg && eduProgsStore.getEduProg.id != 0">
    <VTabs
      v-model="activeTab"
      show-arrows
    >
      <VTab
        v-for="item in tabs"
        :key="item.icon"
        :value="item.tab"
      >
        <VIcon
          size="20"
          start
          :icon="item.icon"
        />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow
      v-model="activeTab"
      class="mt-5 disable-tab-transition"
      :touch="false"
    >
      <!-- Головна -->
      <VWindowItem value="characteristic">
        <EditDocumentCharacteristic :edu-prog="eduProgsStore.getEduProg" />
      </VWindowItem>

      <!-- Перелік компонент -->
      <VWindowItem value="components">
        <EditDocumentComponents />
      </VWindowItem>
      <!-- Структурно логічна схема -->
      <VWindowItem value="sequence">
        <EditDocumentSchema
          @addComponentToScheme="addComponentToScheme"
          @deleteComponentFromSheme="deleteComponentFromSheme"
        />
      </VWindowItem>
      <!-- Структурно логічна послідовнсість -->
      <VWindowItem value="schema">
        <EditDocumentSequence :components="eduProgsStore.getEduProg.components" />
      </VWindowItem>

      <!--   Компоненти ЗК   -->
      <VWindowItem value="compZK">
        <EditDocumentZK />
      </VWindowItem>

      <!-- Матриця -->
      <VWindowItem value="matrix">
        <EditDocumentMatrix />
      </VWindowItem>
    </VWindow>
  </div>
  <v-alert
    v-if="eduProgsStore.getEduProg.id == 0"
    border="bottom"
    colored-border
    type="warning"
    elevation="2"
  >
    ОПП з таким id не знайдено.
  </v-alert>
</template>

<route lang="yaml">
meta:
navActiveLink: pages-account-settings-tab
requiresAuth: true
</route>
