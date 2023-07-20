<template>
  <PageWall
    v-if="page === 'wall'"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia';

import PageWall from '@/modules/target/components/PageWall.vue';
import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;
initStore();
</script>
