<template>
  <div class="h-full flex flex-col">
    <div>
      <div
        class="bg-secondary/40 py-1
    grid grid-flow-col justify-between"
      >
        <div class="flex items-center">
          <img
            src="@/assets/images/logo-track.png"
            alt=""
            class="h-6 px-5"
          >
        </div>
        <div class="grid grid-flow-col content-center text-gray-800 text-2xl font-bold">
          <AppButton
            type="transparent"
            @click="$router.push({ path: '/target' })"
            :is-active="$route.path === '/target'"
            class="mx-12"
          >
            {{ $t("Target") }}
          </AppButton>
          <AppButton
            type="transparent"
            @click="$router.push({ path: '/investigation' })"
            :is-active="$route.path === '/investigation'"
            class="mx-12"
          >
            {{ $t("Investigation") }}
          </AppButton>
          <AppButton
            type="transparent"
            :is-active="$route.path === '/case'"
            class="mx-12"
          >
            {{ $t("Case") }}
          </AppButton>
        </div>
        <div
          class="grid grid-flow-col content-center divide-x-2 divide-gray-500
       text-default"
        >
          <div class="grid content-center px-5 text-2xl">
            {{ user.username }}
          </div>
          <div class="flex">
            <div class="px-5">
              <div>
                {{ current.date }}
              </div>
              <div class="flex justify-end">
                {{ current.time }}
              </div>
            </div>
            <div class="pr-5 grid content-center">
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
      </div>
      <AppDivider />
    </div>

    <div class="flex-grow overflow-hidden w-full flex">
      <slot />
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue';
import spiderman from '@/spiderman';

import useUserStore from '@/stores/user';
import { AppButton, AppDivider } from '../components/app';

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
