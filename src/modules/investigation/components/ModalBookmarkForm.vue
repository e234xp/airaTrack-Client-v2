<template>
  <ModalLayout
    :is-open="modal==='bookmark'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('VmsBookmark') }}
    </template>

    <template #description>
      {{ $t('BookmarkDialog') }}
    </template>

    <template #default>
      <RegionExportItem />

      <AppLabel :label="$t('Comment')">
        <AppInput
          dark
          v-model:modelInput="bookmarkForm.description"
          :placeholder="$t('Comment')"
          :rule="''"
          class="mb-6 text-base"
        />
      </AppLabel>

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
          {{ $t('GenerateVmsBookmark') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useStore from '@/modules/investigation/stores/index';

import RegionExportItem from './RegionExportItem.vue';

defineEmits(['confirm']);

const store = useStore();
const { modal, bookmarkForm } = storeToRefs(store);
const { setModal } = store;
</script>
