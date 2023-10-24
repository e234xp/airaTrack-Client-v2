<template>
  <div class="relative flex justify-center w-full">
    <AppButton type="transparent" active-type="baseline" :is-active="page === item.value" class="text-xl" style="width: 12%"
      @click="setPage(item.value)" v-for="item in optList">
      {{ item.text }}
    </AppButton>

    <div class="absolute right-6 text-base text-default h-full flex flex-col justify-center">
      <div class="text-right">{{ $t('Version') }}: {{ spiderman.system.version }}</div>
      <div class="text-right">{{ $t('EngVersion') }}: {{ devVersion }}</div>
    </div>
  </div>
  <AppDivider />
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import useStore from '@/modules/config/stores/index';
import { AppDivider } from '../../../components/app';

const store = useStore();
const { page } = storeToRefs(store);
const { setPage } = store;

const optList = ref([
  {
    value: 'video',
    text: 'Video Source'
  },
  {
    value: 'channel',
    text: 'Channel'
  },
  {
    value: 'user',
    text: 'User'
  },
  {
    value: 'license',
    text: 'License'
  },
  {
    value: 'system',
    text: 'System'
  }
])

const version = ref('1.00.02.0728');
const devVersion = ref('v1.01.00');
</script>
