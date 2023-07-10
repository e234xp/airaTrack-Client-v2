<template>
  <div class="h-full grid">
    <div
      class="h-fit border-double border-b-4 bg-secondary/50 py-3
    grid grid-flow-col justify-between"
    >
      <div class="ml-2 grid content-center">
        <img
          :src="airaTrackSrc"
          alt=""
          class="w-48"
        >
      </div>
      <div class="grid grid-flow-col content-center text-gray-300 text-3xl font-bold">
        <div
          class="mx-10 cursor-pointer hover:text-primary-hover transition"
          :class="{
            'text-primary': $route.path === '/target'
          }"
        >
          {{ $t('Target') }}
        </div>
        <div
          class="mx-10 cursor-pointer hover:text-primary-hover transition"
          :class="{
            'text-primary': $route.path === '/investigation'
          }"
        >
          {{ $t('Investigation') }}
        </div>
        <div
          class="mx-10 cursor-pointer hover:text-primary-hover transition"
          :class="{
            'text-primary': $route.path === '/case'
          }"
        >
          {{ $t('Case') }}
        </div>
      </div>
      <div
        class="grid grid-flow-col content-center divide-x-2 divide-gray-500
       text-white"
      >
        <div class="grid content-center px-3 text-2xl">
          {{ user.username }}
        </div>
        <div class="px-3">
          <div>
            {{ current.date }}
          </div>
          <div>
            {{ current.time }}
          </div>
        </div>
        <div class="px-3 grid content-center cursor-pointer">
          <div class="rounded bg-gray-700 hover:bg-primary-hover transition">
            <SvgIcon
              name="icon-gear"
              class="text-white w-8 h-8"
            />
          </div>
        </div>
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
import { inject, ref, onUnmounted } from 'vue';

import airaTrack from '@/assets/base64-images/airaTrack';

import useUserStore from '@/stores/user';

const userStore = useUserStore();
const { user } = userStore;

const spiderman = inject('$spiderman');

const airaTrackSrc = spiderman.base64Image.getSrc(airaTrack);

// 定義目前時間
const current = ref({
  date: spiderman.dayjs().format('MMM. DD, YYYY'),
  time: spiderman.dayjs().format('HH:mm:ss'),
});

const timer = setInterval(() => {
  current.value.date = spiderman.dayjs().format('MMM. DD, YYYY');
  current.value.time = spiderman.dayjs().format('HH:mm:ss');
  console.log('refresh timer');
}, 1000);

onUnmounted(() => {
  console.log('clearInterval');
  clearInterval(timer);
});

</script>
