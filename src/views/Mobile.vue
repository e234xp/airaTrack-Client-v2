<template>
  <KeepAlive include="PageList">
    <component
      :is="{
        list: PageList,
        detail: PageDetail,
      }[page]"
    />
  </KeepAlive>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import PageList from '@/modules/target/components/PageList.vue';
import PageDetail from '@/modules/target/components/PageDetail.vue';
import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;
initStore();
</script>
