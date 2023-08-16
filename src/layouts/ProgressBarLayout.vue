<template>
  <div class="h-full flex flex-col">
    <div
      class="h-fit border-b-2 border-gray-500 bg-secondary/50 py-3
    grid grid-flow-col justify-between"
    >
      <div class="ml-2 grid content-center">
        <img
          :src="spiderman.base64Image.getSrc(airaTrack)"
          alt=""
          class="w-48"
        >
      </div>
      <div class="grid grid-flow-col content-center text-gray-300 text-3xl font-bold">
        <AppButton
          type="transparent"
          @click="$router.push({ path: '/target' })"
          :is-active="$route.path === '/target'"
          class="mx-10"
        >
          {{ $t("Target") }}
        </AppButton>
        <AppButton
          type="transparent"
          @click="$router.push({ path: '/investigation' })"
          :is-active="$route.path === '/investigation'"
          class="mx-10"
        >
          {{ $t("Investigation") }}
        </AppButton>
        <AppButton
          type="transparent"
          :is-active="$route.path === '/case'"
          class="mx-10"
        >
          {{ $t("Case") }}
        </AppButton>
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
        <div class="px-3 grid content-center">
          <AppButton
            type="secondary"
            :is-active="$route.path === '/case'"
          >
            <AppSvgIcon
              name="icon-gear"
              class="text-white w-8 h-8"
            />
          </AppButton>
        </div>
      </div>
    </div>
    <div class="flex-grow overflow-hidden w-full flex">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import spiderman from '@/spiderman';

import airaTrack from '@/assets/base64-images/airaTrack';

import useUserStore from '@/stores/user';

const userStore = useUserStore();
const { user } = userStore;

// 定義目前時間
const current = ref({
  date: spiderman.dayjs().format('MMM. DD, YYYY'),
  time: spiderman.dayjs().format('HH:mm:ss'),
});

const timer = setInterval(() => {
  current.value.date = spiderman.dayjs().format('MMM. DD, YYYY');
  current.value.time = spiderman.dayjs().format('HH:mm:ss');
  // console.log('refresh timer');
}, 1000);

onUnmounted(() => {
  console.log('clearInterval');
  clearInterval(timer);
});
</script>
