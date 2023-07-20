<template>
  <ProgressBarLayout>
    <div class="w-full flex flex-col">
      <div
        class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
      >
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl
          border-b-4 border-primary"
        >
          {{ $t('Faces') }}
        </div>
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl"
        >
          {{ $t('Album') }}
        </div>
      </div>

      <div
        class="border-b-2 border-gray-500 py-3 px-6
          grid grid-flow-col justify-between"
      >
        <AppDatePicker
          v-model:modelSelectedDate="selectedDate"
        />
      </div>

      <DayChart
        v-model:modelSelectedDate="selectedDate"
        v-model:modelSelectedHour="selectedHour"
      />

      <div
        class="flex-grow overflow-y-auto flex flex-col"
      >
        <template
          v-for="hourFaceKey in hourFaceKeys"
          :key="hourFaceKey"
        >
          <div
            v-show="hourFaces[hourFaceKey].length > 0"
            class="flex justify-center mb-20 px-5"
          >
            <div class="font-bold text-white text-2xl mr-5">
              {{ spiderman.dayjs(Number(hourFaceKey)).format('HH:mm') }}
            </div>
            <div class="w-full 2xl:w-9/12">
              <AppPagination
                :current-page="hourFacePaginations[hourFaceKey].currentPage"
                :total-items="hourFacePaginations[hourFaceKey].totalItems"
                @on-turn-page="hourFacePaginations[hourFaceKey].onTurnPage"
                class="mb-6"
              />

              <div class="aira-row-auto-2 gap-8">
                <div
                  v-for="face in hourFaces[hourFaceKey]"
                  :key="face.data.id"
                  @click="handleToggleFace(face.data)"
                  class="relative cursor-pointer border-4"
                >
                  <img
                    class="w-full h-full"
                    :src="spiderman.base64Image.getSrc(face.data.face_image)"
                    alt=""
                  >
                  <div class="absolute top-0 left-0 w-full h-full flex justify-end items-end">
                    <div
                      class="w-8 h-8 rounded flex justify-center items-center
                        text-lg font-bold"
                      :class="{
                        'bg-white text-gray-800': face.data.id !== 1,
                      }"
                    >
                      1
                    </div>
                  </div>
                  <template
                    v-if="face.data.id === selectedFace.id"
                  >
                    <div
                      class="absolute inset-0 bg-gray-900 opacity-40"
                    />
                    <div
                      class="absolute top-0 left-0 w-full h-full
                       flex items-center justify-center"
                    >
                      <AppSvgIcon
                        name="icon-check"
                        class="text-white w-16 h-16"
                      />
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>

    <TargetSideBar />
  </ProgressBarLayout>
</template>

<script setup>
import {
  inject, onUnmounted, ref, watch,
} from 'vue';
import { storeToRefs } from 'pinia';

import DayChart from '@/modules/target/components/DayChart.vue';
import TargetSideBar from '@/modules/target/components/SideBar.vue';

import useUserStore from '@/stores/user';
import useLivedevices from '@/stores/livedevices';

import useStore from '@/modules/target/stores/index';

const spiderman = inject('$spiderman');

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);
const livedevicesStore = useLivedevices();
const { livedevices } = storeToRefs(livedevicesStore);

const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));
const selectedHour = ref(parseInt(spiderman.dayjs().format('HH'), 10));

const hourFaceKeys = ref([]);
const hourFaces = ref({});
const hourFacePaginations = ref({});

const store = useStore();
const { selectedFace } = storeToRefs(store);
const { setSelectedFace } = store;

watch([selectedDate, selectedHour], ([date, hour]) => {
  getLiveFaceHourly({ date, hour });
}, { immediate: true });

async function getLiveFaceHourly({ date, hour }) {
  const TEN_MINUTES_MS = 600000;

  // 設定 keys
  hourFaces.value = (() => {
    const firstKey = spiderman.dayjs(`${date} ${hour}:00:00`).valueOf();

    const tmp = {};
    for (let i = 0; i < 6; i += 1) {
      const key = firstKey + i * TEN_MINUTES_MS;
      tmp[key] = [];
    }

    return tmp;
  })();

  hourFaceKeys.value = Object.keys(hourFaces.value)
    .reverse()
    .map((key) => Number(key));

  // 設定 pagination
  hourFacePaginations.value = hourFaceKeys.value.reduce((acc, key) => {
    acc[key] = {
      currentPage: 1,
      totalItems: 0,
      onTurnPage: async (page) => {
        hourFacePaginations.value[key].currentPage = page;

        const startTime = key;
        const endTime = startTime + TEN_MINUTES_MS;
        const { totalItems, data } = await getLiveFaces({
          startTime,
          endTime,
          page,
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

async function getLiveFaces({ startTime, endTime, page }) {
  const PER_PAGE = 24;
  const cameraList = livedevices.value.map(({ camera_id: cameraId }) => cameraId);
  const data = {
    liveupdate: false,
    unifaceupdate: false,
    start_time: startTime,
    end_time: endTime,
    camera_list: cameraList,
    duration: endTime - startTime,
    slice_length: PER_PAGE,
    slice_shift: (page - 1) * PER_PAGE,
    withImage: true,
  };

  const {
    data: {
      result: { total_length: totalLength, data: { 0: { value } } },
    },
  } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/liveface`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data,
  });

  return {
    totalItems: totalLength,
    data: value,
  };
}

function handleToggleFace(face) {
  if (selectedFace.value.id === face.id) {
    setSelectedFace({});
  } else {
    setSelectedFace(face);
  }
}
</script>
