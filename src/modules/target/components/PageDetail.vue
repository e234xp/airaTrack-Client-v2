<template>
  <ProgressBarLayout>
    <FullLayout style="width: max(83%, calc(100% - 20rem))">
      <template #header>
        <div class="flex justify-between m-4">
          <AppButton
            type="secondary"
            class="px-5 py-2 text-3xl"
            @click="setPage('list')"
          >
            {{ $t('Return') }}
          </AppButton>
          <div class="flex items-center text-white text-2xl">
            {{ spiderman.formatDate.parseYMD(selectedFaceKey) }}
            {{ spiderman.dayjs(selectedFaceKey).format('HH:mm') }}
          </div>
          <div />
        </div>
      </template>

      <template #grow>
        <div class="flex justify-center">
          <div class="w-full px-4">
            <FaceList
              :faces="faces"
              type="detail"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center mt-4 mb-16 text-white text-2xl">
          <div
            class="flex items-center cursor-pointer mx-2"
            :class="{
              'pointer-events-none text-gray-400': currentPage === 1,
            }"
            @click="handleTurnPage(1)"
          >
            <AppSvgIcon
              name="icon-chevron-to-end"
              class="w-4 h-4 rotate-180"
            />
          </div>
          <div
            class="flex items-center cursor-pointer mx-2"
            :class="{
              'pointer-events-none text-gray-400': currentPage === 1,
            }"
            @click="handleTurnPage(currentPage - 1)"
          >
            <AppSvgIcon
              name="icon-chevron-left"
              class="w-4 h-4"
            />
          </div>
          <div
            class="mx-8 text-2xl"
          >
            {{ currentPage }} / {{ totalPages }}
          </div>
          <div
            class="flex items-center cursor-pointer mx-2"
            :class="{
              'pointer-events-none text-gray-400': currentPage === totalPages,
            }"
            @click="handleTurnPage(currentPage + 1)"
          >
            <AppSvgIcon
              name="icon-chevron-right"
              class="w-4 h-4"
            />
          </div>
          <div
            class="flex items-center cursor-pointer mx-2"
            :class="{
              'pointer-events-none text-gray-400': currentPage === totalPages,
            }"
            @click="handleTurnPage(totalPages)"
          >
            <AppSvgIcon
              name="icon-chevron-to-end"
              class="w-4 h-4"
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
import useAlbums from '@/stores/albums';

import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';

import useStore from '@/modules/target/stores/index';
import helpers from '@/modules/target/helpers';

const store = useStore();
const { selectedFaceKey, faceListRow, faceListCol, selectedCamera, selectedAlbum, selectedCameraType, selectedAlbumType } = storeToRefs(store);
const { setPage } = store;

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

const albumsStore = useAlbums();
const { albums } = storeToRefs(albumsStore);

// API 參數準備
const startTime = selectedFaceKey.value;
const endTime = (() => {
  const TEN_MINUTES_MS = 600000;
  return startTime + TEN_MINUTES_MS;
})();
// const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);
// const albumIdList = ['', ...albums.value.map(({ albumId }) => albumId)];

const currentPage = ref(1);
const totalItems = ref(null);
// const hourFacePerPage = ref(80);

const hourFacePerPage = computed(() => {
  return (faceListRow.value * 2.5) * faceListCol.value;
})

const totalPages = computed(() => helpers.getTotalPages({
  totalItems: totalItems.value,
  numberPerPage: hourFacePerPage.value,
}));

// const cameraList = selectedCameraType.value === 'all' ? livedevices.value.map(({ camera_id: cameraId }) => cameraId) : selectedCamera.value;
// const albumIdList = selectedAlbumType.value === 'all' ? ['', ...albums.value.map(({ albumId }) => albumId)] : selectedAlbum.value;

const cameraList = computed(() => {
  if (selectedCameraType.value === 'all') {
    return livedevices.value.map(({ camera_id: cameraId }) => cameraId);
  }
  return selectedCamera.value;
});

const albumIdList = computed(() => {
  if (selectedAlbumType.value === 'all') {
    return ['', ...albums.value.map(({ albumId }) => albumId)];
  }
  return selectedAlbum.value;
});

const faces = ref([]);

const performAnimation = helpers.getPerformAnimationFn('detail');

onMounted(async () => {
  ({ data: faces.value, totalItems: totalItems.value } = await helpers.getLiveFaces({
    startTime,
    endTime,
    page: 1,
    perPage: hourFacePerPage.value,
    cameraList: cameraList.value,
    albumIdList: albumIdList.value,
    sessionId: sessionId.value,
  }));

  const currentKey = helpers.getCurrentKey();
  if (selectedFaceKey.value !== currentKey) return;
  performAnimation(faces.value);
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
    cameraList: cameraList.value,
    albumIdList: albumIdList.value,
    sessionId: sessionId.value,
  }));
}

// 每隔一段時間去要最新的 faces
const timer = setInterval(async () => {
  const currentKey = (() => {
    const tenMinutesMs = 10 * 60 * 1000;
    return Math.floor(spiderman.dayjs().valueOf() / tenMinutesMs) * tenMinutesMs;
  })();

  if (selectedFaceKey.value !== currentKey) return;

  await handleTurnPage(currentPage.value);

  performAnimation(faces.value);
}, 10 * 1000);

onUnmounted(() => {
  clearInterval(timer);
});
</script>
