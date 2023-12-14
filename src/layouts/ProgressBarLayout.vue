<template>
  <div class="h-full flex flex-col">
    <div>
      <div class="bg-header py-1 flex justify-between">
        <div class="flex items-center">
          <img src="@/assets/images/logo-track.png" alt="" class="h-6 px-5">
        </div>
        <div class="w-1/3 flex justify-center items-center text-gray-800 text-2xl font-bold">
          <AppButton type="transparent" @click="$router.push({ path: '/target' })" :is-active="$route.path === '/target'"
            class="w-1/3 !text-2xl">
            {{ $t("Target") }}
          </AppButton>
          <AppButton type="transparent" @click="onClickInvest"
            :is-active="$route.path === '/investigation'" class="w-1/3 !text-2xl">
            {{ $t("Investigation") }}
          </AppButton>
          <AppButton type="transparent" @click="$router.push({ path: '/case' })" :is-active="$route.path === '/case'"
            class="w-1/3 !text-2xl">
            {{ $t("Case") }}
          </AppButton>
          <AppButton type="transparent" @click="$router.push({ path: '/debug' })" :is-active="$route.path === '/debug'"
            class="w-1/3 !text-2xl" v-if="testMode">
            Debug
          </AppButton>
        </div>
        <div class="w-80 grid grid-flow-col content-center justify-end divide-x-2 divide-gray-500
       text-default">
          <div class="relative flex items-center gap-1 pr-6 text-xl cursor-pointer" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
            <AppSvgIcon name="icon-user" :color="'#b5bec0'" class="w-8 h-8" />
            {{ user.username }}
            <div class="absolute w-32 z-10 h-12 dialog-hint text-center bg-ctrl-secondary py-3 rounded hover:bg-ctrl-secondary-hover"
              style="top: 100%; left: 50%; transform: translate(-50%, 0);"
              @click="onLogout"
              v-if="hover">
              {{ $t("Logout") }}
            </div>
          </div>
          <div class="flex">
            <div class="flex flex-col justify-center items-end pr-6 pl-6 text-xs">
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
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useUserStore from '@/stores/user';
import useDebugStore from '@/stores/debug';
import { AppButton, AppDivider } from '../components/app';

import useStore from '@/modules/investigation/stores/index';
import successStore from '@/components/AppSuccess/success';

const router = useRouter();

const userStore = useUserStore();
const { user, logout } = userStore;

const debugStore = useDebugStore();
const { testMode } = storeToRefs(debugStore);

const { setPage } = useStore();

// 定義目前時間
const current = ref({
  date: spiderman.formatDate.today(),
  time: spiderman.dayjs().format('HH:mm:ss'),
});

const timer = setInterval(() => {
  current.value.date = spiderman.formatDate.today();
  current.value.time = spiderman.dayjs().format('HH:mm:ss');
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

function onClickInvest() {
  const { path } = router.currentRoute.value;
  if (path === '/investigation') setPage('list');
  else router.push({ path: '/investigation' })
}

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style>
.dialog-hint::after {
  border-color: transparent transparent #404040 transparent;
  border-style: solid solid solid solid;

  /* 設定邊框大小可拼湊出任意形狀的三角形 */
  border-width: 10px 14px;

  top: calc(-1.5rem + 4px);
  left: 50%;
  transform: translate(-50%, 0);

  content: "";
  height: 0px;
  position: absolute;
  width: 0px;
}
</style>
