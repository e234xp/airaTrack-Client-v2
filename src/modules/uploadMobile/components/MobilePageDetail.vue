<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <div class="flex justify-between m-8">
          <AppButton
            type="secondary"
            class="px-5 py-2 text-3xl"
            @click="setPage('list')"
          >
            {{ $t('Return') }}
          </AppButton>
          <div class="flex items-center text-white text-3xl">
            {{ spiderman.dayjs(selectedFaceKey).format('DD MMM, YYYY HH:mm') }}
          </div>
          <div />
        </div>
      </template>

      <template #grow>
        <div class="flex justify-center">
          <div class="w-full 2xl:w-9/12">
            <FaceList
              :faces="faces"
            />
          </div>
        </div>
      </template>
    </FullLayout>
    <SideBar />
  </ProgressBarLayout>
</template>

<script setup>
import {
  computed, onMounted, onUnmounted, ref,
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';

import useStore from '@/modules/target/stores/index';
import helpers from '@/modules/target/helpers';

const store = useStore();
const { selectedFaceKey } = storeToRefs(store);
const { setPage } = store;

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

// API 參數準備
const startTime = selectedFaceKey.value;
const endTime = (() => {
  const TEN_MINUTES_MS = 600000;
  return startTime + TEN_MINUTES_MS;
})();
const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);

const currentPage = ref(1);
const totalItems = ref(null);
const hourFacePerPage = ref(80);

const totalPages = computed(() => helpers.getTotalPages({
  totalItems: totalItems.value,
  numberPerPage: hourFacePerPage.value,
}));

const faces = ref([]);

onMounted(async () => {
  ({ data: faces.value, totalItems: totalItems.value } = await helpers.getLiveFaces({
    startTime,
    endTime,
    page: 1,
    perPage: hourFacePerPage.value,
    cameraList,
    sessionId: sessionId.value,
  }));
});

async function handleTurnPage(pageNumber) {
  if (pageNumber >= 1 && pageNumber <= totalPages.value) {
    currentPage.value = pageNumber;
  }

  ({ data: faces.value, totalItems: totalItems.value } = await helpers.getLiveFaces({
    startTime,
    endTime,
    page: currentPage.value,
    perPage: hourFacePerPage.value,
    cameraList,
    sessionId: sessionId.value,
  }));
}

// 每隔一段時間去要最新的 faces
const timer = setInterval(() => {
  const currentKey = (() => {
    const tenMinutesMs = 10 * 60 * 1000;
    return Math.floor(spiderman.dayjs().valueOf() / tenMinutesMs) * tenMinutesMs;
  })();

  if (selectedFaceKey.value !== currentKey) return;

  handleTurnPage(currentPage.value);
}, 10 * 1000);

onUnmounted(() => {
  clearInterval(timer);
});
</script>
