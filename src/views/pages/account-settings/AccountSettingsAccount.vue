<script setup>
import avatar1 from '@/assets/images/avatars/avatar-1.png'
import { useUserStore } from '@/stores/user'
const userStore = useUserStore()
onMounted( async () => {
    await userStore.fetchUserData()
})
const oneDigitRegex = ".*\\d+.*"
const changePassword =( async() => {
  const oneLetterRegex = ".*[a-z].*"
  if(confirmPassword.value != newPassword.value) {
    isPasswordErrorVisible.value = true
    passwordErrorText.value = "Паролі не співпадають"
  } else if(
    newPassword.value.length < 8 ||
    !newPassword.value.match(oneLetterRegex) ||
    !newPassword.value.match(oneDigitRegex)
  ) {
    isPasswordErrorVisible.value = true
    passwordErrorText.value = "Пароль не відповідає вимогам"
  } else if(currentPassword.value == newPassword.value){
    isPasswordErrorVisible.value = true
    passwordErrorText.value = "Старий та новий пароль співпадають"
  } else {
    try {
      await userStore.changePassword(currentPassword.value, newPassword.value)
      await userStore.fetchUserData()
      newPassword.value=''
      confirmPassword.value=''
      currentPassword.value=''
    } catch(error) {
      isPasswordErrorVisible.value = true
      passwordErrorText.value = "Невірний старий пароль"
    }
  }
})
const userData = computed(() => userStore.getUserData)
const avatarImg= avatar1;
const isCurrentPasswordVisible = ref(false)
const isNewPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordRequirements = [
  'Мінімум 8 символів - чим більше, тим краще',
  'Принаймні один малий регістр',
  'Принаймні одне число, символ або пробіл',
]
const isPasswordErrorVisible = ref(false)
const passwordErrorText = ref('')
const isNameErrorVisible = ref(false)
const nameErrorText = ref('')
const newName = ref('')
const changeName =( async() => {
  if(newName.value.length < 3) {
    isNameErrorVisible.value = true
    nameErrorText.value = "Ім'я занадто коротке"
  } else if(newName.value.match(oneDigitRegex)) {
    isNameErrorVisible.value = true
    nameErrorText.value = "Ім'я не повинно містити цифр"
  } else {
    await userStore.changeUserName(newName.value)
    await userStore.fetchUserData()
    newName.value=''
  }
})
// const changeAvatar = file => {
//   const fileReader = new FileReader()
//   const {files} = file.target
//   if (files && files.length) {
//     fileReader.readAsDataURL(files[0])
//     fileReader.onload = () => {
//       if (typeof fileReader.result === 'string')
//         accountDataLocal.value.avatarImg = fileReader.result
//     }
//   }
// }

// reset avatar image
// const resetAvatar = () => {
//   accountDataLocal.value.avatarImg = accountData.avatarImg
// }
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard title="Інформація про акаунт">
        <VCardText class="d-flex">
          <!-- 👉 Avatar -->
          <VAvatar
            rounded="lg"
            size="100"
            class="me-6"
            :image="avatarImg"
          />
          
          <v-row>
            <p class="text-body-1 mb-0">
              Iм'я: {{ userData.name }}
            </p>
          </v-row>
          <v-row>
            <p class="text-body-1 mb-0">
              Пошта: {{ userData.email }}
            </p>
          </v-row>
          
          <!-- 👉 Upload Photo -->
          <!-- <form
            ref="refForm"
            class="d-flex flex-column justify-center gap-5"
          >
            <div class="d-flex flex-wrap gap-2">
              <VBtn
                color="primary"
                @click="refInputEl?.click()"
              >
                <VIcon
                  icon="mdi-cloud-upload-outline"
                  class="d-sm-none"
                />
                <span class="d-none d-sm-block">Завантажити нове фото</span>
              </VBtn>

              <input
                ref="refInputEl"
                type="file"
                name="file"
                accept=".jpeg,.png,.jpg,GIF"
                hidden
                @input="changeAvatar"
              >

              <VBtn
                type="reset"
                color="error"
                variant="tonal"
                @click="resetAvatar"
              >
                <span class="d-none d-sm-block">Повернути назад</span>
                <VIcon
                  icon="mdi-refresh"
                  class="d-sm-none"
                />
              </VBtn>
            </div>

            <p class="text-body-1 mb-0">
              Дозволено JPG, GIF або PNG. Максимальний розмір 800K
            </p>
          </form> -->

        </VCardText>

      </VCard>
      </VCol>
      <VCol cols="12">
        <VCard title="Змінити ім'я">
        <VCardText >
          <!-- 👉 Form -->
          <VForm class="mt-6">
            <VRow>
              <!-- 👉 First Name -->
              <VCol
                md="6"
                cols="12"
              >
                <VTextField
                  label="Введіть сюди нове ім'я"
                  @input='isNameErrorVisible = false'
                  v-model="newName"
                />
              
                <div class='mt-4'>
                  <VAlert 
                    type="error" 
                    :class="isNameErrorVisible ? 'd-flex' : 'd-none'"
                  >
                    {{ unref(nameErrorText) }}
                  </VAlert>
                </div>
              </VCol>


              <!-- 👉 Form Actions -->
              <VCol
                cols="12"
                class="d-flex flex-wrap gap-4"
              >
                <VBtn @click="changeName">Зберегти зміни</VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <VCol cols="12">
      <VCard title="Змінити пароль">
        <VForm>
          <VCardText>
            <!-- 👉 Current Password -->
            <VRow class="mb-3">
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 current password -->
                <VTextField
                  v-model="currentPassword"
                  :type="isCurrentPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isCurrentPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Старий пароль"
                  @click:append-inner="isCurrentPasswordVisible = !isCurrentPasswordVisible"
                  @input='isPasswordErrorVisible = false'
                />
              </VCol>
            </VRow>

            <!-- 👉 New Password -->
            <VRow>
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 new password -->
                <VTextField
                  v-model="newPassword"
                  :type="isNewPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isNewPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Новий пароль"
                  @click:append-inner="isNewPasswordVisible = !isNewPasswordVisible"
                  @input='isPasswordErrorVisible = false'
                />
              </VCol>
                
              <VCol
                cols="12"
                md="6"
              >
                <!-- 👉 confirm password -->
                <VTextField
                  v-model="confirmPassword"
                  :type="isConfirmPasswordVisible ? 'text' : 'password'"
                  :append-inner-icon="isConfirmPasswordVisible ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                  label="Повторіть пароль"
                  @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  @input='isPasswordErrorVisible = false'
                />
              </VCol>
            </VRow>

            <div class='mt-4'>
              <VAlert 
                type="error" 
                :class="isPasswordErrorVisible ? 'd-flex' : 'd-none'"
              >
                {{ unref(passwordErrorText) }}
              </VAlert>
            </div>
          </VCardText>

          <!-- 👉 Password Requirements -->
          <VCardText>
            <p class="text-base font-weight-medium mt-2">
              Вимоги до паролю:
            </p>

            <ul class="d-flex flex-column gap-y-3">
              <li
                v-for="item in passwordRequirements"
                :key="item"
                class="d-flex"
              >
                <div>
                  <VIcon
                    size="7"
                    icon="mdi-circle"
                    class="me-3"
                  />
                </div>
                <span class="font-weight-medium">{{ item }}</span>
              </li>
            </ul>
          </VCardText>

          <!-- 👉 Action Buttons -->
          <VCardText class="d-flex flex-wrap gap-4">
            <VBtn @click="changePassword">Зберегти зміни</VBtn>

            <VBtn
              type="reset"
              color="secondary"
              variant="tonal"
            >
              Повернути назад
            </VBtn>
          </VCardText>
        </VForm>
      </VCard>
    </VCol>
  </VRow>
</template>
