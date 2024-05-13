<template>
  <ModalLayout
    :is-open="true"
    @close="handleClose"
  >
    <template #header>
      {{ $t('ResetPassword') }}
    </template>

    <template #description>
      {{ $t('ResetPasswordDialog') }}
    </template>

    <template #default>
      <AppLabel :label="$t('LoginUsername')">
        <AppInput v-model:modelInput="form.username" @valid="(val) => userValid.username = val" class="mb-4" dark />
      </AppLabel>

      <AppLabel :label="$t('License')">
        <AppInput v-model:modelInput="form.license" @valid="(val) => userValid.license = val" class="mb-4" dark />
      </AppLabel>
      
      <AppLabel :label="$t('NewPassword')">
        <AppInput v-model:modelInput="form.password" @valid="(val) => userValid.password = val" dark />
      </AppLabel>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="handleClose"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          :isEnable="userValid.check"
          @click="handleReset"
        >
          {{ $t('Reset') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, reactive, computed, onBeforeMount } from 'vue';

import useUserStore from '@/stores/user';
import successStore from '@/components/AppSuccess/success';

const userStore = useUserStore();
const { resetLicensePassword } = userStore;

const emit = defineEmits(['close']);

const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})

const form = ref({
  username: '',
  license: '',
  password: '',
});

const userValid = reactive({
  username: false,
  license: false,
  password: false,
  check: computed(() => {
    return userValid.username && userValid.license && userValid.password;
  })
})

async function handleReset() {
  const result = await resetLicensePassword(form.value);
  if (result) {
    successStore.show();
    emit('close');
  }
}

function handleClose() {
  emit('close');
}

onBeforeMount(() => {
  form.value.username = props.name;
  if (form.value.username !== '') userValid.username = true;
})

</script>
