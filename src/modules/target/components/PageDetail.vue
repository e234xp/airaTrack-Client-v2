<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <div class="flex justify-start m-4">
          <AppButton
            type="secondary"
            class="px-5 py-1 text-2xl"
            @click="setPage('list')"
          >
            {{ $t('Return') }}
          </AppButton>
        </div>
      </template>

      <template #grow>
        <div class="flex justify-center">
          <div class="w-full 2xl:w-9/12">
            <FaceList
              :faces="faces"
              :selected-face="selectedFace"
              :on-toggle-face="handleToggleFace"
            />
          </div>
        </div>
      </template>

      <template #footer>
        <div class="flex justify-center mt-4 mb-10">
          <AppPagination
            :per-page="80"
            :current-page="currentPage"
            :total-items="totalItems"
            @on-turn-page="handleTurnPage"
            class="mr-5"
          />
        </div>
      </template>
    </FullLayout>
    <SideBar />
  </ProgressBarLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';

import useStore from '@/modules/target/stores/index';
import helpers from '@/modules/target/helpers';

const store = useStore();
const { selectedFace, selectedFaceKey } = storeToRefs(store);
const { setSelectedFace, setPage } = store;

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

const faces = ref([]);

onMounted(async () => {
  ({ data: faces.value, totalItems: totalItems.value } = await helpers.getLiveFaces({
    startTime, endTime, page: 1, perPage: 80, cameraList, sessionId: sessionId.value,
  }));
});

async function handleTurnPage(pageNumber) {
  currentPage.value = pageNumber;

  ({ data: faces.value, totalItems: totalItems.value } = await helpers.getLiveFaces({
    startTime, endTime, page: pageNumber, perPage: 80, cameraList, sessionId: sessionId.value,
  }));
}

function handleToggleFace(face) {
  if (selectedFace.value?.data?.id === face.data.id) {
    setSelectedFace(null);
  } else {
    setSelectedFace(face);
  }
}
</script>
