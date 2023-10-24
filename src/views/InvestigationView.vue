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

import PageList from '@/modules/investigation/components/PageList.vue';
import PageDetail from '@/modules/investigation/components/PageDetail.vue';
import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { page, caseData } = storeToRefs(store);
const { initStore, setPage, switchCaseData} = store;
initStore();

if (caseData.value) {
  setPage('detail');
  switchCaseData();
}
</script>
