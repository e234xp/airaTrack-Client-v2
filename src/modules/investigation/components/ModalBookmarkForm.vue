<template>
  <ModalLayout
    size="176"
    :is-open="modal==='bookmark'"
  >
    <template #header>
      {{ $t('VmsBookmark') }}
    </template>

    <template #default>
      <div class="mb-8 text-xl">
        <div
          class="border-4 border-double rounded mb-2 flex"
        >
          <img
            class="w-36 h-36 mr-8"
            :src="spiderman.base64Image.getSrc(bookmarkForm.firstResult.faceImage)"
            alt=""
          >
          <div class="flex flex-col justify-center text-2xl">
            <div class="my-1">
              {{ bookmarkForm.firstResult.deviceName }}
            </div>
            <div class="my-1">
              {{ spiderman.dayjs(bookmarkForm.firstResult.timestamp)
                .format('YYYY/MM/DD HH:mm:ss') }}
            </div>
          </div>
        </div>
        <div
          v-if="bookmarkForm.resultLength > 1"
          class="flex"
        >
          <div>
            {{ $t('AndMore', { number: bookmarkForm.resultLength - 1 }) }}
          </div>
        </div>
      </div>

      <div class="mb-2 text-2xl">
        {{ $t('Description') }}
      </div>

      <AppInput
        v-model:modelInput="bookmarkForm.description"
        :placeholder="$t('Description')"
        class="mb-8 text-2xl"
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

defineEmits(['confirm']);

const store = useStore();
const { modal, bookmarkForm } = storeToRefs(store);
const { setModal } = store;
</script>
