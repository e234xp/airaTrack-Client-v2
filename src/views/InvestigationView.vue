<template>
  <component
    :is="{
      list: PageList,
    }[page]"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia';

import PageList from '@/modules/investigation/components/PageList.vue';

import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;
initStore();
</script>
