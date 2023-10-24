<template>
  <div>
    <div
      class="grid grid-flow-col justify-center text-2xl"
    >
      <AppButton
        type="transparent"
        active-type="baseline"
        :is-active="page === 'list'"
        class="w-56 text-xl"
        @click="setPage('list')"
      >
        <p>{{ $t('FaceBoard') }}</p>
      </AppButton>

      <AppButton
        type="transparent"
        active-type="baseline"
        :is-active="page === 'album-list' || page === 'album-detail'"
        class="w-56 text-xl"
        @click="setPage('album-list')"
      >
        <p>{{ $t('Album') }}</p>
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
