<script setup>
import { useRoute } from 'vue-router'
import EditDocumentCharacteristic from '@/views/pages/edit-document/EditDocumentCharacteristic.vue'
import EditDocumentComponents from '@/views/pages/edit-document/EditDocumentComponents.vue'
import EditDocumentSchema from '@/views/pages/edit-document/EditDocumentSchema.vue'
import EditDocumentSequence from '@/views/pages/edit-document/EditDocumentSequence.vue'
import { useEduProgsStore } from '@/stores/eduProgs.js'
const eduProgsStore = useEduProgsStore()

const route = useRoute()
const activeTab = ref(route.params.tab)
onMounted(async ()=>{
  await eduProgsStore.findEduProgById(23)
})
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
    title: 'Структурно-логічна послідовність ОПП',
    icon: 'mdi-format-line-style',
    tab: 'schema',
  },
  {
    title: 'Структурно логічна схема',
    icon: 'mdi-table',
    tab: 'sequence',
  },
]
</script>

<template>
  <div>
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
      v-if="!eduProgsStore.isLoading && eduProgsStore.getEduProg"
    >
      <!-- Головна -->
      <VWindowItem value="characteristic">
        <EditDocumentCharacteristic :edu-prog="eduProgsStore.getEduProg"/>
      </VWindowItem>

      <!-- Перелік компонент -->
      <VWindowItem value="components">
        <EditDocumentComponents :components="eduProgsStore.getEduProgComponents" />
      </VWindowItem>

      <!-- Структурно логічна послідовнсість -->
      <VWindowItem value="schema">
        <EditDocumentSequence/>
      </VWindowItem>

      <!-- Структурно логічна схема -->
      <VWindowItem value="sequence">
        <EditDocumentSchema />
      </VWindowItem>
    </VWindow>
  </div>
</template>

<route lang="yaml">
meta:
navActiveLink: pages-account-settings-tab
</route>
