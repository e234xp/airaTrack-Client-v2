<template>
  <div
    class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
  >
    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="page === 'list'"
      class="px-8 py-4 font-bold text-2xl"
      @click="setPage('list')"
    >
      {{ $t('Faces') }}
    </AppButton>

    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="page === 'album'"
      class="px-8 py-4 font-bold text-2xl"
      @click="setPage('album')"
    >
      {{ $t('Album') }}
    </AppButton>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { setPage } = store;
</script>
