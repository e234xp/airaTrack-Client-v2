<template>
  <div>
    <div
      class="grid grid-flow-col justify-center text-2xl"
    >
      <AppButton
        type="transparent"
        active-type="baseline"
        :is-active="page === 'list'"
        class="px-20 py-3"
        @click="setPage('list')"
      >
        {{ $t('Faces') }}
      </AppButton>

      <AppButton
        type="transparent"
        active-type="baseline"
        :is-active="page === 'album-list' || page === 'album-detail'"
        class="px-20 py-3"
        @click="setPage('album-list')"
      >
        {{ $t('Album') }}
      </AppButton>
    </div>
    <AppDivider />
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';
import { AppDivider } from '../../../components/app';

const store = useStore();
const { page } = storeToRefs(store);
const { setPage } = store;
</script>
