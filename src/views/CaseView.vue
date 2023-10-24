<template>
  <ProgressBarLayout>
    <PageList></PageList>
  </ProgressBarLayout>
</template>
<script setup>
import PageList from '@/modules/case/components/PageList.vue';
import useStore from '@/modules/case/stores/index';

const store = useStore();
const { initStore } = store;
initStore();
</script>