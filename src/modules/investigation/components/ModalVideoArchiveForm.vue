<template>
  <ModalLayout
    :is-open="modal==='archive'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('VideoArchiveTitle') }}
    </template>

    <template #description>
      {{ $t('VideoArchiveDialog') }}
    </template>

    <template #default>
      <RegionExportItem />

      <AppLabel :label="$t('Title')">
        <AppInput
          dark
          v-model:modelInput="archiveForm.title"
          :placeholder="$t('Title')"
          class="mb-4 text-base"
        />
      </AppLabel>

      <AppLabel :label="$t('Subject')">
        <AppInput
          dark
          v-model:modelInput="archiveForm.subject"
          :placeholder="$t('Subject')"
          class="mb-4 text-base"
        />
      </AppLabel>

      <AppLabel :label="$t('Remark')">
        <AppInput
          dark
          v-model:modelInput="archiveForm.remark"
          :placeholder="$t('Remark')"
          class="mb-6 text-base"
          rule=""
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
          :isEnable="archiveForm.title !== '' && archiveForm.subject !== ''"
          @click="
            emit('add');
          "
        >
          {{ $t('Yes') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/investigation/stores/index';
import RegionExportItem from './RegionExportItem.vue';

const store = useStore();
const { modal, archiveForm } = storeToRefs(store);
const { setModal } = store;

const emit = defineEmits(['add']);
</script>
