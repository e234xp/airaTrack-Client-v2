<template>
  <div
    class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
  >
    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="page==='list' && dataType === 'all'"
      @click="
        setPage('list');
        setDataType('all');
      "
      class="px-8 py-4 font-bold text-2xl"
    >
      {{ $t('All') }}
    </AppButton>

    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="page==='list' && dataType === 'finish'"
      @click="
        setPage('list');
        setDataType('finish');
      "
      class="px-8 py-4 font-bold text-2xl"
    >
      {{ $t('Completed') }}
    </AppButton>

    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="page==='list' && dataType === 'progress'"
      @click="
        setPage('list');
        setDataType('progress');
      "
      class="px-8 py-4 font-bold text-2xl"
    >
      {{ $t('Processing') }}
    </AppButton>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { page, dataType } = storeToRefs(store);
const { setPage, setDataType } = store;
</script>
