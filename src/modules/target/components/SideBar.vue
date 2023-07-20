<template>
  <div class="w-96 bg-gray-600 grid content-between">
    <div>
      <div
        class="mb-4 px-8 py-4 text-white text-left text-2xl font-bold"
      >
        {{ $t('Target') }}
      </div>

      <div class="aira-button aira-button--secondary mx-6 mb-8 py-3 font-bold">
        {{ $t('Upload') }}
      </div>

      <div class="mx-6 mb-8">
        <div
          v-if="selectedFace.face_image"
          class="aira-row-auto-1 gap-4"
        >
          <div
            class="cursor-pointer border-4"
          >
            <img
              class="w-full h-full"
              :src="spiderman.base64Image.getSrc(selectedFace.face_image)"
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
      <div
        @click="setPage('checking')"
        class="aira-button aira-button--primary mx-6 mb-4 py-3 font-bold"
        :class="{ 'aira-button--disable': !selectedFace.id }"
      >
        {{ $t('Investigation') }}
      </div>
      <div
        class="aira-button aira-button--secondary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('ClearSelection') }}
      </div>
      <div
        class="aira-button aira-button--secondary mx-6 mb-4 py-3 font-bold
      aira-button--disable"
      >
        {{ $t('SaveToAlbum') }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';

const spiderman = inject('$spiderman');

const store = useStore();
const { setPage } = store;
const { selectedFace } = storeToRefs(store);
</script>
