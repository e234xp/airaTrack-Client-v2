<template>
  <div class="mb-4 text-xl">
    <div
      class="border border-general rounded mb-2 flex p-2"
    >
      <img
        class="w-36 h-36 mr-4"
        :src="spiderman.base64Image.getSrc(selectedExport.firstResult.faceImage)"
        alt=""
      >
      <div class="flex flex-col justify-center text-xl" style="width: calc(100% - 10rem)">
        <div>
          {{ spiderman.dayjs(selectedExport.firstResult.timestamp)
            .format('YYYY/MM/DD HH:mm:ss') }}
        </div>
        <div class="truncate">
          {{ selectedExport.firstResult.deviceName }}
        </div>
      </div>
    </div>
    <div
      v-if="selectedExport.resultLength > 1"
      class="flex"
    >
      <div>
        {{ $t('AndMore', { number: selectedExport.resultLength - 1 }) }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { selectedExport } = storeToRefs(store);
</script>

<style></style>