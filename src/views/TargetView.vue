<template>
  <PageWall
    v-if="page === 'wall'"
  />
  <PageWall
    v-else-if="page === 'detail'"
  />
  <PageAddingInvestgation
    v-else-if="page === 'adding-investgation'"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia';

import PageWall from '@/modules/target/components/PageWall.vue';
import PageAddingInvestgation from '@/modules/target/components/PageAddingInvestgation.vue';

import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;
initStore();
</script>
