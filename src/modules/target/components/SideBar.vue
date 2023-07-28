<template>
  <div class="w-96 bg-gray-600 grid content-between">
    <div>
      <div
        class="mb-4 px-8 py-4 text-white text-left text-2xl font-bold"
      >
        {{ $t('Target') }}
      </div>

      <AppButton
        type="secondary"
        class="mx-6 mb-8 py-3"
      >
        {{ $t("Upload") }}
      </AppButton>

      <div class="mx-6 mb-8">
        <div
          v-if="selectedFace"
          class="aira-row-auto-1 gap-4"
        >
          <div
            class="cursor-pointer border-4"
          >
            <img
              class="w-full h-full"
              :src="spiderman.base64Image.getSrc(selectedFace?.data.face_image)"
              alt=""
            >
          </div>
        </div>
        <div
          v-else
          class="break-words text-xl text-gray-300"
        >
          {{ $t('SelectTargetPrompt') }}
        </div>
      </div>
    </div>

    <div class="mb-4">
      <AppButton
        type="primary"
        :is-enable="!!selectedFace?.data.id"
        class="mx-6 mb-4 py-3"
        @click="setPage('adding-investgation')"
      >
        {{ $t("Investigation") }}
      </AppButton>
      <AppButton
        type="secondary"
        :is-enable="!!selectedFace?.data.id"
        class="mx-6 mb-4 py-3"
        @click="setSelectedFace(null)"
      >
        {{ $t("ClearSelection") }}
      </AppButton>
      <AppButton
        type="secondary"
        :is-enable="!!selectedFace?.data.id"
        class="mx-6 mb-4 py-3"
      >
        {{ $t("SaveToAlbum") }}
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useStore from '@/modules/target/stores/index';

const store = useStore();
const { setPage } = store;
const { selectedFace } = storeToRefs(store);
const { setSelectedFace } = store;
</script>
