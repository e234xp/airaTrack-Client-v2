<template>
  <ModalLayout
    :is-open="modal==='pdf'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('GeneratePdfReport') }}
    </template>

    <template #description>
      {{ $t('SaveToPdfDialog') }}
    </template>

    <template #default>
      <div class="text-xl">
        {{ $t('Title') }}
      </div>
      <AppInput
        dark
        v-model:modelInput="pdfForm.title"
        :placeholder="$t('Title')"
        class="mb-4 text-base"
      />
      <div class="text-xl">
        {{ $t('Subject') }}
      </div>
      <AppInput
        dark
        v-model:modelInput="pdfForm.subject"
        :placeholder="$t('Subject')"
        class="mb-4 text-base"
      />
      <div class="text-xl">
        {{ $t('Remark') }}
      </div>
      <AppInput
        dark
        v-model:modelInput="pdfForm.remark"
        :placeholder="$t('Remark')"
        class="mb-6 text-base"
        rule=""
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
          class="px-6"
          v-print="{
            id: 'printPdf',
            popTitle: 'airaTrack Investigation Report'
          }"
          @click="
            setModal('');
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

const store = useStore();
const { modal, pdfForm } = storeToRefs(store);
const { setModal } = store;
</script>
