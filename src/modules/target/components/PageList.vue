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
            class="flex justify-center"
          >
            <div class="w-full" ref="container">
              <div class="pl-6 flex gap-4">
                <div class="flex">
                  <div class="grid content-center text-white text-2xl leading-4">
                    {{ spiderman.dayjs(Number(faceKey)).format('HH:mm') }}
                  </div>
                </div>
                <div class="flex items-center" style="width: calc(100% - 9rem)">
                  <AppDivider />
                </div>
                <div
                  class="w-6 rounded-lg flex justify-center items-center text-default
                  cursor-pointer hover:text-primary-hover transition"
                  :class="{
                    'pointer-events-none opacity-40': hourFacePaginations[faceKey].currentPage === 1
                  }"
                  @click="hourFacePaginations[faceKey]
                    .onTurnPage(hourFacePaginations[faceKey].currentPage - 1)"
                >
                  <AppSvgIcon
                    name="icon-chevron-left"
                    class="w-4 h-4"
                  />
                </div>
                <div
                  class="w-6 rounded-lg flex justify-center items-center text-default
                        cursor-pointer hover:text-primary-hover transition"
                  :class="{
                    'pointer-events-none opacity-40': hourFacePaginations[faceKey]
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
                    class="w-4 h-4"
                  />
                </div>
                <div class="flex items-center w-24">
                  <AppButton
                    type="transparent"
                    class="text-2xl leading-5 !py-0"
                    @click="handleToDetail(faceKey)"
                  >
                    <div class="flex">
                      <div class="flex items-center text-default text-base">
                        {{ $t('Extend') }}
                      </div>
                      <span class="more" >
                        <span class="hz" ></span>
                        <span class="vt" ></span>
                      </span>
                    </div>
                  </AppButton>
                </div>
              </div>

              <div class="mt-3 mb-4 ml-6 mr-5 flex justify-center">
                <FaceList
                  :faces="hourFaces[faceKey]"
                  type="list"
                  class="flex-grow"
                />
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
  onUnmounted, ref, watch, onMounted, onBeforeMount
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
// const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);

const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));
const selectedHour = ref(parseInt(spiderman.dayjs().format('HH'), 10));

const hourFaceKeys = ref([]);
const hourFaces = ref({});
const hourFacePaginations = ref({});
const hourFacePerPage = ref(24);

const container = ref(null);

const store = useStore();
const { setPage, setSelectedFaceKey } = store;
const { selectedCamera } = storeToRefs(store);

watch([selectedDate, selectedHour], ([date, hour]) => {
  getLiveFaceHourly({ date, hour });
}, { immediate: true });

watch(selectedCamera, async () => {
  const currentKey = helpers.getCurrentKey();
  
  await Promise.allSettled(hourFaceKeys.value.map(async (key) => {
    const result = await hourFacePaginations.value[key].onTurnPage(
      hourFacePaginations.value[key].currentPage,
    );
    if (key !== currentKey) return { result };

    performAnimation(hourFaces.value[key]);
    return { result };
  }));
});

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
          cameraList: selectedCamera.value,
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

<style lang="scss">
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
    transform: scale(2.3);
    opacity: 0.4;
  }
  100% {
    transform: scale(2.4);
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
  animation: pulse 1.2s ease;
  border-radius: 1rem;
  border: 4px double #3cb2fe;
}

.more {

  $size : 28px;
  $cross: 2px;
  $timing: 0.1s;
  $ease: ease-in;

  position: relative;
  display: block;
  cursor: pointer;
  transition: $timing;
  transition-timing-function: $ease;

  width: $size;
  height: $size;
  border-radius: 0.2em;
  background: transparent;

  .hz, .vt {
    position: absolute;
    top: 50%;
    left: 50%;
    transition: $timing;
    transition-timing-function: $ease;
    transform: translate(-50%, -50%);
  }

  .hz {
    border-top: $cross solid rgb(181 190 192);
    width: 40%;
  }

  .vt {
    height: 40%;
    &:before {
      content: " ";
      display:block;
      height: 50%;
      border-right: $cross solid rgb(181 190 192);
    }
    &:after {
      content: " ";
      display:block;
      top: 50%;
      height: 50%;
      border-right: $cross solid rgb(181 190 192);
    }
    &:before, &:after {
      transition: $timing;
      transition-timing-function: $ease;
      transform: rotate(0deg);
    }
  }

  &:hover {
    .hz {
      transform: translate(-50%, -50%);
      width: 50%;
      border-color: rgb(60 178 254);
    }
    
    .vt {
      transform: translate(140%, -50%);
    }
    .vt:before {
      transform: rotate(-45deg);
      border-color: rgb(60 178 254);
    }
    .vt:after {
      transform: rotate(45deg);
      border-color: rgb(60 178 254);
    }
  }
}
</style>
