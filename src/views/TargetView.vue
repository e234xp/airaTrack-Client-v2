<template>
  <KeepAlive include="PageList">
    <component
      :is="{
        list: PageList,
        detail: PageDetail,
        'adding-investgation': PageAddingInvestgation,
        'album-list': PageAlbumList,
        'album-detail': PageAlbumDetail,
      }[page]"
    />
  </KeepAlive>
</template>

<script setup>
import { storeToRefs } from 'pinia';

import PageList from '@/modules/target/components/PageList.vue';
import PageDetail from '@/modules/target/components/PageDetail.vue';
import PageAddingInvestgation from '@/modules/target/components/PageAddingInvestgation.vue';
import PageAlbumList from '@/modules/target/components/PageAlbumList.vue';
import PageAlbumDetail from '@/modules/target/components/PageAlbumDetail.vue';

import useStore from '@/modules/target/stores/index';

const store = useStore();
const { page } = storeToRefs(store);
const { initStore } = store;

initStore();
</script>
