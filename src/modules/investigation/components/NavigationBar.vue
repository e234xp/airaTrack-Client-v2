<template>
  <div
    class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
  >
    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="dataType === 'all'"
      @click="setDataType('all')"
      class="px-8 py-4 font-bold text-2xl"
    >
      {{ $t('All') }}
    </AppButton>

    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="dataType === 'finish'"
      @click="setDataType('finish')"
      class="px-8 py-4 font-bold text-2xl"
    >
      {{ $t('Finish') }}
    </AppButton>

    <AppButton
      type="transparent"
      active-type="baseline"
      :is-active="dataType === 'progress'"
      @click="setDataType('progress')"
      class="px-8 py-4 font-bold text-2xl"
    >
      {{ $t('Running') }}
    </AppButton>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { dataType } = storeToRefs(store);
const { setDataType } = store;
</script>
