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
      <div class="mb-4 text-xl">
        <div
          class="border border-gray-400 rounded mb-2 flex p-2"
        >
          <img
            class="w-36 h-36 mr-4"
            :src="spiderman.base64Image.getSrc(bookmarkForm.firstResult.faceImage)"
            alt=""
          >
          <div class="flex flex-col justify-center text-xl">
            <div>
              {{ bookmarkForm.firstResult.deviceName }}
            </div>
            <div>
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

      <div class="text-xl">
        {{ $t('Comment') }}
      </div>

      <AppInput
        dark
        v-model:modelInput="bookmarkForm.description"
        :placeholder="$t('Comment')"
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

defineEmits(['confirm']);

const store = useStore();
const { modal, bookmarkForm } = storeToRefs(store);
const { setModal } = store;
</script>
