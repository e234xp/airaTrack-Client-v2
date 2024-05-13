<template>
  <ProgressBarLayout>
    <FullLayout style="width: max(83.4%, calc(100% - 20rem))">
      <template #header>
        <NavigationBar />

        <DayChart
          v-model:modelSelectedDate="parseDate"
          v-model:modelSelectedHour="parseHour"
          v-model:modelSelectedTimeType="parseTimeType"
          v-model:modelSelectedCameraType="parseCameraType"
          v-model:modelSelectedAlbumType="parseAlbumType"
          @updateData="onUpdateData"
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
            <div class="w-full" style="width: 99%;">
              <div class="pl-2 flex gap-4">
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
                    <div class="flex expand-hint">
                      <div class="flex items-center text-default text-base">
                        {{ $t('Extend') }}
                      </div>
                      <span class="more">
                        <span class="hz" ></span>
                        <span class="vt" ></span>
                      </span>
                    </div>
                  </AppButton>
                </div>
              </div>

              <div class="mt-2 mb-4 ml-4 mr-5 flex justify-center">
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
  onUnmounted, ref, watch, onMounted, computed
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import DayChart from '@/modules/target/components/DayChart.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';

import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';
import useAlbums from '@/stores/albums';

import useStore from '@/modules/target/stores/index';
import helpers from '@/modules/target/helpers';

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const devicesStore = useDevices();
const { livedevices } = storeToRefs(devicesStore);

const albumsStore = useAlbums();
const { albums } = storeToRefs(albumsStore);

// const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));
// const selectedHour = ref(parseInt(spiderman.dayjs().format('HH'), 10));
// const selectTimeType = ref('now');

const hourFaceKeys = ref([]);
const hourFaces = ref({});
const hourFacePaginations = ref({});
const hourFacePerPage = ref(0);

const store = useStore();
const { setPage, setSelectedFaceKey, setFaceListSize, setSelectedCameraType, setSelectedAlbumType,
setSelectedTimeType, setSelectedHour, setSelectedDate } = store;
const { 
  selectedCamera, selectedAlbum, selectedCameraType, selectedAlbumType,
  selectedTimeType, selectedDate, selectedHour,
} = storeToRefs(store);

const parseCameraType = computed({
  get: () => selectedCameraType.value,
  set: (value) => {
    setSelectedCameraType(value);
  },
});

const parseAlbumType = computed({
  get: () => selectedAlbumType.value,
  set: (value) => {
    setSelectedAlbumType(value);
  },
});

const parseTimeType = computed({
  get: () => selectedTimeType.value,
  set: (value) => {
    setSelectedTimeType(value);
  },
});

const parseHour = computed({
  get: () => selectedHour.value,
  set: (value) => {
    setSelectedHour(value);
  },
});

const parseDate = computed({
  get: () => selectedDate.value,
  set: (value) => {
    setSelectedDate(value);
  },
});

watch([selectedCamera, selectedAlbum, selectedCameraType, selectedAlbumType], async () => {
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

function onUpdateData() {
  getLiveFaceHourly({ date: selectedDate.value, hour: selectedHour.value });
}

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
        const cameraList = selectedCameraType.value === 'all' ? livedevices.value.map(({ camera_id: cameraId }) => cameraId) : selectedCamera.value;
        const albumIdList = selectedAlbumType.value === 'all' ? ['', ...albums.value.map(({ albumId }) => albumId)] : selectedAlbum.value;

        const { totalItems, data } = await helpers.getLiveFaces({
          startTime,
          endTime,
          page: pageNumber,
          perPage: hourFacePerPage.value,
          cameraList,
          albumIdList,
          sessionId: sessionId.value,
        });
        // const filter = data.filter((item) => selectedAlbumType.value === 'all' || selectedAlbum.value.indexOf((item?.highest?.albumId || '') === '' ? '0' : item.highest.albumId) >= 0);

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
  // await Promise.allSettled(hourFaceKeys.value.map(async (key) => {
  //   const result = await hourFacePaginations.value[key].onTurnPage(1);
  //   if (key !== currentKey) return { result };

  //   performAnimation(hourFaces.value[key]);
  //   return { result };
  // }));
  hourFaceKeys.value.reduce((chain, key) => {
    return chain.then(async () => {
      const result = await hourFacePaginations.value[key].onTurnPage(1);
      if (key !== currentKey) return { result };

      performAnimation(hourFaces.value[key]);
      return { result };
    });
  }, Promise.resolve())
}

const timer = setInterval(async () => {
  const currentKey = helpers.getCurrentKey();
  if (selectedTimeType.value !== 'now') return;
  if (!hourFaceKeys.value.includes(currentKey)) return;

  await hourFacePaginations.value[currentKey].onTurnPage(
    hourFacePaginations.value[currentKey].currentPage,
  );

  performAnimation(hourFaces.value[currentKey]);
}, 10 * 1000);

function handleResize() {
  const temp = hourFacePerPage.value;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;
  for (const rule of helpers.sizeMap) {
    const { range, row, col } = rule;
    if (ratio >= range[0] && ratio < range[1]) {
      // hourFaceListRow.value = row;
      // hourFaceListCol.value = col;
      setFaceListSize({ row, col });
      hourFacePerPage.value = row * col;
      if (temp !== 0 && temp !== hourFacePerPage.value) onUpdateData();
      return;
    }
  }
}

onMounted(() => {
  handleResize();
  window.addEventListener('resize', handleResize);
  onUpdateData();
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
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

@keyframes pulse-hint {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  80% {
    transform: scale(2.2);
    opacity: 0.3;
  }
  100% {
    transform: scale(2.6);
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
  animation: pulse-hint 1.2s ease;
  border-radius: 1rem;
}

.album-none::before {
  border: 0.375rem double theme('colors.album-none');
}

.album-1::before {
  border: 0.375rem double theme('colors.album-1');
}

.album-2::before {
  border: 0.375rem double theme('colors.album-2');
}

.album-3::before {
  border: 0.375rem double theme('colors.album-3');
}

.album-4::before {
  border: 0.375rem double theme('colors.album-4');
}

.album-5::before {
  border: 0.375rem double theme('colors.album-5');
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

  // &:hover {
  //   .hz {
  //     transform: translate(-50%, -50%);
  //     width: 50%;
  //     border-color: rgb(60 178 254);
  //   }
    
  //   .vt {
  //     transform: translate(140%, -50%);
  //   }
  //   .vt:before {
  //     transform: rotate(-45deg);
  //     border-color: rgb(60 178 254);
  //   }
  //   .vt:after {
  //     transform: rotate(45deg);
  //     border-color: rgb(60 178 254);
  //   }
  // }
}

.expand-hint:hover {
  div {
    color: rgb(60 178 254);
  }

  .more {
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
