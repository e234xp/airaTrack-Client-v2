<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />

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
            class="flex justify-center pl-5 pr-2"
          >
            <div class="w-full" ref="container">
              <div class="pl-6 pr-2 flex justify-start">
                <div class="flex">
                  <div class="grid content-center text-white text-2xl leading-4">
                    {{ spiderman.dayjs(Number(faceKey)).format('HH:mm') }}
                  </div>
                </div>
                <div class="flex items-center">
                  <AppButton
                    type="transparent"
                    class="px-4 text-2xl leading-5"
                    @click="handleToDetail(faceKey)"
                  >
                    <div class="flex gap-0 hover:gap-2 transition-all">
                      <div class="mr-1 flex items-center text-default text-base">
                        {{ $t('Extend') }}
                      </div>
                      <div class="flex items-center text-white">
                        <AppSvgIcon
                          name="icon-chevron-right"
                          class="w-3 h-3"
                        />
                      </div>
                    </div>
                  </AppButton>
                </div>
                <div class="flex-grow flex items-center w-full">
                  <AppDivider />
                </div>
              </div>

              <div class="mt-4 mb-8 ml-6 flex justify-between">
                <div
                  class="min-h-2row w-14 rounded-lg bg-transparent
                  mr-5 flex justify-center items-center text-default
                  cursor-pointer hover:bg-secondary transition"
                  :class="{
                    'pointer-events-none opacity-0': hourFacePaginations[faceKey]
                      .currentPage === 1,
                  }"
                  @click="hourFacePaginations[faceKey]
                    .onTurnPage(hourFacePaginations[faceKey].currentPage - 1)"
                >
                  <AppSvgIcon
                    name="icon-chevron-left"
                    class="w-5 h-5"
                  />
                </div>
                <FaceList
                  :faces="hourFaces[faceKey]"
                  type="list"
                  class="flex-grow"
                />
                <div
                  class="min-h-2row w-14 rounded-lg bg-transparent
                        mx-3 flex justify-center items-center text-default
                        cursor-pointer hover:bg-secondary transition"
                  :class="{
                    'pointer-events-none opacity-0': hourFacePaginations[faceKey]
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
                    class="w-5 h-5"
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
import { AppDivider } from '../../../components/app';

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

const container = ref(null);

const store = useStore();
const {
  setPage, setSelectedFaceKey,
} = store;

watch([selectedDate, selectedHour], ([date, hour]) => {
  getLiveFaceHourly({ date, hour });
}, { immediate: true });

const performAnimation = helpers.getPerformAnimationFn('list');

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

        const dummy = data.length > 0 ? [...data, ...new Array(hourFacePerPage.value - data.length).fill().map(() => ({ data: { id: ''} }))] : data;
        hourFaces.value[key] = dummy;
        hourFacePaginations.value[key].totalItems = totalItems;

        return data;
      },
    };
    return acc;
  }, {});

  const currentKey = helpers.getCurrentKey();
  // 去同時要每 10 分鐘的資料
  await Promise.allSettled(hourFaceKeys.value.map(async (key) => {
    const result = await hourFacePaginations.value[key].onTurnPage(1);
    if (key !== currentKey) return { result };

    performAnimation(hourFaces.value[key]);
    return { result };
  }));
}

const timer = setInterval(async () => {
  const currentKey = helpers.getCurrentKey();
  if (!hourFaceKeys.value.includes(currentKey)) return;

  await hourFacePaginations.value[currentKey].onTurnPage(
    hourFacePaginations.value[currentKey].currentPage,
  );

  performAnimation(hourFaces.value[currentKey]);
}, 10 * 1000);

onUnmounted(() => {
  clearInterval(timer);
});

function handleToDetail(faceKey) {
  setSelectedFaceKey(faceKey);
  setPage('detail');
}
</script>

<style>
/* 定義動畫 */
@keyframes colorTransition {
  0%, 100% {
    background-color: #2c77a0;
  }
  50% {
    background-color: #3cb2fe;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  60% {
    transform: scale(1.7);
    opacity: 0.4;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* 添加動畫效果 */
.animate-color-transition {
  animation: colorTransition 1s forwards infinite;
}

.animate-pulse-transition::before {
  content: '';
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: pulse 1.5s ease;
  border-radius: 1rem;
  border: 4px double #3cb2fe;
}
</style>
