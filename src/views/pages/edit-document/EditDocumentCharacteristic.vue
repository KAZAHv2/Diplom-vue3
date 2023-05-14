<script setup>
import { useEduProgsStore } from '@/stores/eduProgs.js'
const props = defineProps(['eduProg'])
const route = useRoute()
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
const eduProgsStore = useEduProgsStore()
const saveChanges = async () => {
  await eduProgsStore.editEduprog(eduProgData)
}
const eduProgData = props.eduProg



onBeforeMount(async () => {
})
</script>


<template>
  <VCard>
    <VCardText>
      <VContainer>
        <VRow>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.name"
              label="Назва документу "
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.education_level"
              label="Освітній рівень"
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.stage"
              label="Освітній ступінь"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.speciality"
              label="Спеціальність"
              required
            />
          </VCol>
          <VCol
            cols="12"
          >
            <VTextField
              v-model="eduProgData.knowledge_field"
              label="Галузь знань"
              required
            />
          </VCol>
        </VRow>
        <VRow justify="end">
          <VBtn
            class="mt-10"
            dark
            @click="saveChanges"
          >
            Зберегти зміни
          </VBtn>
        </VRow>
      </VContainer>
    </VCardText>
  </VCard>
</template>


