<template>
  <div class="relative flex justify-center w-full">
    <AppButton type="transparent" active-type="baseline" :is-active="page === item.value" class="text-xl" style="width: 12%"
      @click="setPage(item.value)" v-for="item in optList">
      {{ item.text }}
    </AppButton>

    <div class="absolute right-4 text-sm text-default h-full flex flex-col justify-center">
      <div class="text-right"><span style="user-select: none;">{{ $t('Version') }}: </span>{{ spiderman.system.version }}</div>
      <div class="text-right"><span style="user-select: none;">{{ $t('EngVersion') }}: </span>{{ devVersion }}</div>
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

import { useI18n } from 'vue-i18n';

const store = useStore();
const { page } = storeToRefs(store);
const { setPage } = store;

const i18n = useI18n();

const optList = ref([
  {
    value: 'video',
    text: i18n.t('VideoSource')
  },
  {
    value: 'channel',
    text: i18n.t('Channel')
  },
  {
    value: 'user',
    text: i18n.t('User')
  },
  {
    value: 'license',
    text: i18n.t('License')
  },
  {
    value: 'system',
    text: i18n.t('System')
  }
])

const version = ref('1.00.02.0728');
const devVersion = ref('v1.01.00');
</script>
