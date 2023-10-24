<template>
  <ModalLayout :is-open="modal === 'case'" @close="setModal('')">
    <template #header>
      {{ $t('AddToCase') }}
    </template>

    <template #default>
      <div class="text-xl">
        {{ $t('CaseName') }}
      </div>

      <AppInput
        dark
        v-model:modelInput="name"
        :placeholder="'Name'"
        class="mb-4 text-base"
      />

      <div class="text-xl">
        {{ $t('CaseDescription') }}
      </div>

      <AppInput
        dark
        v-model:modelInput="description"
        :rule="''"
        :placeholder="$t('Description')"
        class="mb-6 text-base"
      />
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
          :isEnable="name !== ''"
          class="px-6"
          @click="$emit('add', { name, description })"
        >
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/investigation/stores/index';

defineEmits(['add']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const name = ref('');
const description = ref('');
</script>