<template>
  <div
    class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
  >
    <div
      class="aira-button px-8 py-4 text-white hover:text-primary font-bold text-2xl"
      :class="{
        'border-b-4 border-primary': page === 'wall'
      }"
      @click="setPage('wall')"
    >
      {{ $t('Faces') }}
    </div>
    <div
      class="aira-button px-8 py-4 text-white hover:text-primary font-bold text-2xl"
      :class="{
        'border-b-4 border-primary': page === 'album'
      }"
      @click="setPage('album')"
    >
      {{ $t('Album') }}
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { setPage } = store;
</script>
