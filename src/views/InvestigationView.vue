<template>
  <KeepAlive include="PageList">
    <component
      :is="{
        list: PageList,
        detail: PageDetail,
      }[page]"
    />
  </KeepAlive>

  <ModalLayout
    size="2/6"
    :is-open="modal==='pdf'"
  >
    <template #header>
      {{ $t('GeneratePDFReport') }}
    </template>

    <template #default>
      <div class="mb-2 text-2xl">
        {{ $t('Title') }}
      </div>
      <AppInput
        v-model:modelInput="pdfForm.title"
        :placeholder="$t('Title')"
        class="mb-8 text-2xl"
      />
      <div class="mb-2 text-2xl">
        {{ $t('Subject') }}
      </div>
      <AppInput
        v-model:modelInput="pdfForm.subject"
        :placeholder="$t('Subject')"
        class="mb-8 text-2xl"
      />
      <div class="mb-2 text-2xl">
        {{ $t('Remark') }}
      </div>
      <AppInput
        v-model:modelInput="pdfForm.remark"
        :placeholder="$t('Remark')"
        class="mb-8 text-2xl"
        rule=""
      />
    </template>

    <template #footer>
      <div class="flex justify-end text-2xl">
        <AppButton
          type="secondary"
          class="ml-6 px-6 py-2"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="ml-6 px-6 py-2"
          v-print="{
            id: 'printPdf',
            popTitle: 'PDF',
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

import PageList from '@/modules/investigation/components/PageList.vue';
import PageDetail from '@/modules/investigation/components/PageDetail.vue';
import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { page, modal, pdfForm } = storeToRefs(store);
const { initStore, setModal } = store;
initStore();
</script>
