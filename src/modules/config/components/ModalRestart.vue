<template>
  <ModalLayout :is-open="modal === 'restart'" @close="setModal('')">
    <template #header>
      {{ $t('RestartTitle') }}
    </template>

    <template #description>
      {{ $t('RestartDialog') }}
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          @click="$emit('confirm')"
        >
          {{ $t('Confirm') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/config/stores/index';

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

defineEmits(['confirm']);
</script>

<style scoped>

</style>
