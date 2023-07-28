<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />

        <div
          class="border-b-2 border-gray-500 py-3 px-6
          grid grid-flow-col justify-between"
        >
          <AppDatePicker
            v-model:modelSelected="selectedDate"
          />
        </div>

        <DayChart
          v-model:modelSelectedDate="selectedDate"
          v-model:modelSelectedHour="selectedHour"
        />
      </template>

      <template #grow>
        <template
          v-for="faceKey in hourFaceKeys"
          :key="faceKey"
        >
          <div
            v-show="hourFaces[faceKey].length > 0"
            class="flex justify-center mb-20 px-5"
          >
            <div class="w-full 2xl:w-9/12">
              <div class="flex mb-5 justify-between">
                <div class="flex">
                  <div class="grid content-center font-bold text-white text-2xl mr-5">
                    {{ spiderman.dayjs(Number(faceKey)).format('HH:mm') }}
                  </div>
                  <AppPagination
                    :current-page="hourFacePaginations[faceKey].currentPage"
                    :total-items="hourFacePaginations[faceKey].totalItems"
                    @on-turn-page="hourFacePaginations[faceKey].onTurnPage"
                    class="mr-5"
                  />
                </div>
                <div class="grid content-center">
                  <AppButton
                    type="secondary"
                    class="px-5 py-1"
                    @click="handleToDetail(faceKey)"
                  >
                    {{ $t('Detail') }}
                  </AppButton>
                </div>
              </div>

              <FaceList
                :faces="hourFaces[faceKey]"
                :selected-face="selectedFace"
                :on-toggle-face="handleToggleFace"
              />
            </div>
          </div>
        </template>
      </template>
    </FullLayout>

    <SideBar />
  </ProgressBarLayout>
</template>

<script setup>
import {
  inject, onUnmounted, ref, watch,
} from 'vue';
import { storeToRefs } from 'pinia';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import DayChart from '@/modules/target/components/DayChart.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';

import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

import useStore from '@/modules/target/stores/index';
import helpers from '@/modules/target/helpers';

const spiderman = inject('$spiderman');

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);
const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);
const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);

const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));
const selectedHour = ref(parseInt(spiderman.dayjs().format('HH'), 10));

const hourFaceKeys = ref([]);
const hourFaces = ref({});
const hourFacePaginations = ref({});

const store = useStore();
const { selectedFace } = storeToRefs(store);
const { setSelectedFace, setPage, setSelectedFaceKey } = store;

watch([selectedDate, selectedHour], ([date, hour]) => {
  getLiveFaceHourly({ date, hour });
}, { immediate: true });

async function getLiveFaceHourly({ date, hour }) {
  const TEN_MINUTES_MS = 600000;

  hourFaces.value = (() => {
    const firstKey = spiderman.dayjs(`${date} ${hour}:00:00`).valueOf();

    const tmp = {};
    for (let i = 0; i < 6; i += 1) {
      const key = firstKey + i * TEN_MINUTES_MS;
      tmp[key] = [];
    }

    return tmp;
  })();

  // 設定 keys
  hourFaceKeys.value = Object.keys(hourFaces.value)
    .reverse()
    .map((key) => Number(key));

  // 設定 pagination
  hourFacePaginations.value = hourFaceKeys.value.reduce((acc, key) => {
    acc[key] = {
      currentPage: 1,
      totalItems: 0,
      onTurnPage: async (pageNumber) => {
        hourFacePaginations.value[key].currentPage = pageNumber;

        const startTime = key;
        const endTime = startTime + TEN_MINUTES_MS;

        const { totalItems, data } = await helpers.getLiveFaces({
          startTime, endTime, page: pageNumber, perPage: 24, cameraList, sessionId: sessionId.value,
        });

        hourFaces.value[key] = data;
        hourFacePaginations.value[key].totalItems = totalItems;

        return data;
      },
    };
    return acc;
  }, {});

  // 去同時要每 10 分鐘的資料
  await Promise.allSettled(hourFaceKeys.value.map(async (key) => {
    const result = await hourFacePaginations.value[key].onTurnPage(1);

    return { result };
  }));
}

// 每隔一段時間去要最新的 faces
const timer = setInterval(() => {
  const currentKey = (() => {
    const tenMinutesMs = 10 * 60 * 1000;
    return Math.floor(spiderman.dayjs().valueOf() / tenMinutesMs) * tenMinutesMs;
  })();

  if (!hourFaceKeys.value.includes(currentKey)) return;

  hourFacePaginations.value[currentKey].onTurnPage(
    hourFacePaginations.value[currentKey].currentPage,
  );
}, 10 * 1000);

onUnmounted(() => {
  clearInterval(timer);
});

function handleToggleFace(face) {
  if (selectedFace.value?.data?.id === face.data.id) {
    setSelectedFace(null);
  } else {
    setSelectedFace(face);
  }
}

function handleToDetail(faceKey) {
  setSelectedFaceKey(faceKey);
  setPage('detail');
}
</script>
