<template>
  <ModalLayout :is-open="modal === 'case'" @close="onCancel">
    <template #header>
      {{ $t('AddToCase') }}
    </template>

    <template #description>
      {{ $t('AddToCaseDialog') }}
    </template>

    <template #default>
      <RegionExportItem />

      <AppLabel :label="$t('CaseName')">
        <AppInput
          dark
          v-model:modelInput="name"
          :placeholder="$t('CaseName')"
          class="mb-4 text-base"
        />
      </AppLabel>

      <AppLabel :label="$t('CaseDescription')">
        <AppInput
          dark
          v-model:modelInput="description"
          :rule="''"
          :placeholder="$t('Description')"
          class="mb-6 text-base"
        />
      </AppLabel>

    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="onCancel"
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

import RegionExportItem from './RegionExportItem.vue';

defineEmits(['add']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const name = ref('');
const description = ref('');

function onCancel() {
  name.value = '';
  description.value = '';
  setModal('')
}
</script>