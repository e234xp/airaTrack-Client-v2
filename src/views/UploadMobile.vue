<template>
  <KeepAlive include="MobilePageList">
    <component
      :is="{
        list: MobilePageList,
        detail: MobilePageDetail,
      }[page]"
    />
  </KeepAlive>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import MobilePageList from '@/modules/uploadMobile/components/MobilePageList.vue';
import MobilePageDetail from '@/modules/uploadMobile/components/MobilePageDetail.vue';
import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;
initStore();
</script>
