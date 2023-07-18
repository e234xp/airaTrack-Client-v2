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
          !{{ $t('Faces') }}
        </div>
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl"
        >
          !{{ $t('Album') }}
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
      {{ selectedDate }}
      {{ selectedHour }}

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
              <AppPagination class="mb-6" />

              <div class="aira-row-auto-2 gap-8">
                <div
                  v-for="face in hourFaces[hourFaceKey]"
                  :key="face.data.id"
                  class="relative cursor-pointer"
                >
                  <img
                    class="w-full h-full border-4"
                    :class="{
                      'border-primary': face.data.id === 1,
                      'border-white': face.data.id !== 1,
                    }"
                    :src="spiderman.base64Image.getSrc(face.data.face_image)"
                    alt=""
                  >
                  <div class="absolute top-0 left-0 w-full h-full flex justify-end items-end">
                    <div
                      class="w-8 h-8 rounded flex justify-center items-center
                        text-lg font-bold"
                      :class="{
                        'bg-primary text-white': face.data.id === 1,
                        'bg-white text-gray-800': face.data.id !== 1,
                      }"
                    >
                      1
                    </div>
                  </div>
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
import { inject, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import DayChart from '@/components/DayChart.vue';
import TargetSideBar from '@/components/TargetSideBar.vue';

import useUserStore from '@/stores/user';

const spiderman = inject('$spiderman');

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));
const selectedHour = ref(parseInt(spiderman.dayjs().format('HH'), 10));

const hourFaceKeys = ref([]);
const hourFaces = ref({});

watch([selectedDate, selectedHour], ([date, hour]) => {
  getLiveFaceHourly({ date, hour });
}, { immediate: true });

async function getLiveFaceHourly({ date, hour }) {
  const TEN_MINUTES_MS = 600000;

  // 先設定好 keys
  hourFaces.value = (() => {
    const firstKey = spiderman.dayjs(`${date} ${hour}:00:00`).valueOf();

    const tmp = {};
    for (let i = 0; i < 6; i += 1) {
      const key = firstKey + i * TEN_MINUTES_MS;
      tmp[key] = [];
    }

    return tmp;
  })();

  hourFaceKeys.value = Object.keys(hourFaces.value).reverse();

  // 去同時要每 10 分鐘的資料
  await Promise.allSettled(hourFaceKeys.value.map(async (key) => {
    const startTime = Number(key);
    const endTime = startTime + TEN_MINUTES_MS;
    const result = await getLiveFaces({ startTime, endTime });
    hourFaces.value[key] = result;

    return { result };
  }));
}

async function getLiveFaces({ startTime, endTime }) {
  const data = {
    liveupdate: false,
    unifaceupdate: false,
    start_time: startTime,
    end_time: endTime,
    camera_list: [
      'cb6204be-b7da-a989-d802-42b73a4099ad',
      '571f6c69-4bda-1e6d-a48e-84c47ece1319',
      '6f64e48d-3c17-f805-037c-fb7cc0024284',
      '210e1ef9-3e1b-a74b-8df9-2d8c546da844',
      'dacf7044-940a-2b21-6edb-d6154f31659a',
      '4ae0f8f7-48f4-5836-58ae-846058fd48d1',
      'c078347d-5e8a-f900-6170-f994a86823c3',
    ],
    duration: endTime - startTime,
    slice_length: 24,
    slice_shift: 0,
    withImage: true,
  };

  const { data: { result: { data: { 0: { value } } } } } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/liveface`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data,
  });

  return value;
}
</script>
