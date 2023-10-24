<template>
  <div class="h-full flex flex-col">
    <div>
      <div class="bg-secondary/40 py-1 flex justify-between">
        <div class="flex items-center">
          <img src="@/assets/images/logo-track.png" alt="" class="h-6 px-5">
        </div>
        <div class="w-1/3 flex justify-center items-center text-gray-800 text-2xl font-bold">
          <AppButton type="transparent" @click="$router.push({ path: '/target' })" :is-active="$route.path === '/target'"
            class="w-1/3 !text-2xl">
            {{ $t("Target") }}
          </AppButton>
          <AppButton type="transparent" @click="$router.push({ path: '/investigation' })"
            :is-active="$route.path === '/investigation'" class="w-1/3 !text-2xl">
            {{ $t("Investigation") }}
          </AppButton>
          <AppButton type="transparent" @click="$router.push({ path: '/case' })" :is-active="$route.path === '/case'"
            class="w-1/3 !text-2xl">
            {{ $t("Case") }}
          </AppButton>
        </div>
        <div class="w-80 grid grid-flow-col content-center justify-end divide-x-2 divide-gray-500
       text-default">
          <div class="grid content-center px-5 text-xl cursor-pointer" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
            <template v-if="hover">
              <AppSvgIcon name="icon-logout" @click="onLogout" class="text-gray-300 w-8 h-8" />
            </template>
            <template v-else>{{ user.username }}</template>
          </div>
          <div class="flex">
            <div class="flex flex-col justify-center items-end px-4 text-xs">
              <div>
                {{ current.date }}
              </div>
              <div>
                {{ current.time }}
              </div>
            </div>
            <div class="pr-4 grid content-center">
              <AppButton :type="$route.path !== '/config' ? 'secondary' : 'primary'"
                @click="$router.push({ path: '/config' })"
                class="!p-0">
                <AppSvgIcon name="icon-gear" class="text-white w-8 h-8" />
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
import { useRouter } from 'vue-router';
import spiderman from '@/spiderman';

import useUserStore from '@/stores/user';
import { AppButton, AppDivider } from '../components/app';

import successStore from '@/components/AppSuccess/success';

const router = useRouter();

const userStore = useUserStore();
const { user, logout } = userStore;

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

const hover = ref(false);

function onMouseEnter() {
  hover.value = true;
}

function onMouseLeave() {
  hover.value = false;
}

async function onLogout() {
  const result = await logout();
  if (result) {
    successStore.show();
    router.push({ path: '/' })
  }
}

onUnmounted(() => {
  clearInterval(timer);
});
</script>
