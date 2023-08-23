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
            <div class="w-full">
              <div class="mb-5 px-2 flex justify-start">
                <div class="flex">
                  <div class="grid content-center text-white text-3xl">
                    {{ spiderman.dayjs(Number(faceKey)).format('HH:mm') }}
                  </div>
                </div>
                <div class="flex items-center">
                  <AppButton
                    type="transparent"
                    class="px-5 py-1 text-2xl text-gray-100"
                    @click="handleToDetail(faceKey)"
                  >
                    <div class="mr-1 flex items-center">
                      {{ $t('Extend') }}
                    </div>
                    <div class="flex items-center">
                      <AppSvgIcon
                        name="icon-chevron-right"
                        class="w-5 h-5"
                      />
                    </div>
                  </AppButton>
                </div>
                <div class="flex-grow flex items-center">
                  <hr class="w-full border-gray-400">
                </div>
              </div>

              <div class="flex justify-between">
                <div
                  class="min-h-2row w-16 rounded bg-gray-800
                  mx-3 flex justify-center items-center text-white
                  cursor-pointer hover:bg-primary-hover transition"
                  :class="{
                    'pointer-events-none bg-opacity-40': hourFacePaginations[faceKey]
                      .currentPage === 1
                  }"
                  @click="hourFacePaginations[faceKey]
                    .onTurnPage(hourFacePaginations[faceKey].currentPage - 1)"
                >
                  <AppSvgIcon
                    name="icon-chevron-left"
                    class="w-8 h-8"
                  />
                </div>
                <FaceList
                  :faces="hourFaces[faceKey]"
                  class="flex-grow"
                />
                <div
                  class="min-h-2row w-16 rounded bg-gray-800
                        mx-3 flex justify-center items-center text-white
                        cursor-pointer hover:bg-primary-hover transition"
                  :class="{
                    'pointer-events-none bg-opacity-40': hourFacePaginations[faceKey]
                      .currentPage === helpers.getTotalPages({
                        totalItems: hourFacePaginations[faceKey].totalItems,
                        numberPerPage: hourFacePerPage,
                      })
                  }"
                  @click="hourFacePaginations[faceKey]
                    .onTurnPage(hourFacePaginations[faceKey].currentPage + 1)"
                >
                  <AppSvgIcon
                    name="icon-chevron-right"
                    class="w-8 h-8"
                  />
                </div>
              </div>
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
  onUnmounted, ref, watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import DayChart from '@/modules/target/components/DayChart.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';

import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

import useStore from '@/modules/target/stores/index';
import helpers from '@/modules/target/helpers';

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
const hourFacePerPage = ref(24);

const store = useStore();
const {
  setPage, setSelectedFaceKey,
} = store;

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
          startTime,
          endTime,
          page: pageNumber,
          perPage: hourFacePerPage.value,
          cameraList,
          sessionId: sessionId.value,
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

function handleToDetail(faceKey) {
  setSelectedFaceKey(faceKey);
  setPage('detail');
}
</script>
