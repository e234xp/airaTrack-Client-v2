<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="flex h-full">
          <div class="w-144 border-r-2 border-gray-500">
            <FullLayout>
              <template #header>
                <div class="border-b-2 border-gray-500 p-6 text-white">
                  <div class="mb-4 text-3xl">
                    Target
                  </div>
                  <div class="flex">
                    <img
                      class="w-40 h-40 mr-8"
                      :src="spiderman.base64Image.getSrc(selectedTask.target_face_image)"
                      alt=""
                    >
                    <div class="flex-grow text-2xl">
                      <div class="mb-3">
                        {{ targetDevice.name }}
                      </div>
                      <div class="mb-3">
                        {{ spiderman.dayjs(selectedTask.target.timestamp)
                          .format('YYYY/MM/DD HH:mm:ss') }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="border-gray-500 p-6 text-white">
                  <div class="mb-4 text-3xl">
                    List Target Score :
                    {{ targetScore }}
                  </div>
                  <div class="flex">
                    <div class="text-2xl">
                      0.5
                    </div>
                    <div class="mx-3 flex-grow flex items-center">
                      <input
                        type="range"
                        class="w-full h-2 bg-gray-200
                              rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                        v-model="targetScore"
                        :min="0.5"
                        :max="1"
                        :step="0.05"
                      >
                    </div>
                    <div class="text-2xl">
                      1.0
                    </div>
                  </div>
                </div>
                <div class="flex mb-6 px-6 text-white text-3xl">
                  <AppCheckBox
                    class="mx-4"
                    :placeholder="$t('SelectAll')"
                    :checked="selectedResultIndexes.length === taskResults.length"
                    @on-change="handleSelectAll"
                  />
                  <div>
                    ({{ selectedResultIndexes.length }})
                  </div>
                </div>
              </template>

              <template #grow>
                <div
                  v-for="(result, index) in taskResults"
                  :key="index"
                  class="flex mb-6 px-6"
                >
                  <AppCheckBox
                    class="mx-4"
                    v-model:modelInput="selectedResultIndexes"
                    :value="index"
                  />
                  <div
                    class="flex-grow border-4 border-double rounded
                    flex text-white text-xl cursor-pointer"
                    :class="{
                      'bg-gradient-to-br from-green-600 to-green-900':index === videoResultIndex
                    }"
                    @click="setVideoResultIndex({
                      index,
                      results: taskResults,
                    })"
                  >
                    <img
                      class="w-28 h-28 mr-8"
                      :src="spiderman.base64Image.getSrc(result.highest.face_image)"
                      alt=""
                    >
                    <div class="flex flex-col justify-center">
                      <div class="mb-2">
                        {{ findDevice(result.highest.cid).name }}
                      </div>
                      <div class="mb-2">
                        {{ spiderman.dayjs(result.highest.timestamp)
                          .format('YYYY/MM/DD HH:mm:ss') }}
                      </div>
                    </div>
                  </div>
                </div>
              </template>

              <!-- todo is-enable -->
              <template #footer>
                <div class="py-4 px-4">
                  <div class="aira-row-auto-4 gap-4">
                    <AppButton
                      @click="handlePdfExport"
                      type="primary"
                      :is-enable="true"
                      class="px-16 py-3"
                    >
                      {{ $t("PdfExport") }}
                    </AppButton>
                    <AppButton
                      type="primary"
                      :is-enable="true"
                      class="px-16 py-3"
                    >
                      {{ $t("AddToCase") }}
                    </AppButton>
                    <AppButton
                      type="primary"
                      :is-enable="true"
                      class="px-16 py-3"
                    >
                      {{ $t("VmsBookmark") }}
                    </AppButton>
                  </div>
                </div>
              </template>
            </FullLayout>
          </div>

          <FullLayout>
            <template #header>
              <div class="mx-4 my-8 flex text-white text-4xl">
                <div class="mr-8">
                  {{
                    videoResult
                      ? findDevice(videoResult.highest.cid).name
                      : '-'
                  }}
                </div>
                <div class="mr-8">
                  {{
                    videoResult
                      ? spiderman.dayjs(videoResult.highest.timestamp)
                        .format('YYYY/MM/DD HH:mm:ss')
                      : '-'
                  }}
                </div>
              </div>

              <div
                class="mb-6 flex flex-col"
                v-if="videoProgressBarTimeSlot?.startTime
                  && videoProgressBarTimeSlot?.endTime"
              >
                <div class="mb-4 flex justify-start text-white text-2xl">
                  <div class="px-4 whitespace-nowrap flex items-center">
                    {{ spiderman.dayjs(videoProgressBarTimeSlot.startTime)
                      .format('YYYY/MM/DD HH:mm:ss') }}
                  </div>
                  <div>
                    ~
                  </div>
                  <div class="px-4 whitespace-nowrap flex items-center">
                    {{ spiderman.dayjs(videoProgressBarTimeSlot.endTime)
                      .format('YYYY/MM/DD HH:mm:ss') }}
                  </div>
                </div>

                <div class="mx-4 flex justify-center text-white">
                  <div
                    class="flex items-center cursor-pointer"
                    :class="{
                      'invisible': videoProgressBarTimeSlot
                        .startTime === videoProgressBarInfo?.minStartTime
                    }"
                    @click="setProgressBar({
                      startTime: videoProgressBarTimeSlot.startTime - 1 * 60 * 60 * 1000,
                      results: taskResults,
                    })"
                  >
                    <AppSvgIcon
                      name="icon-chevron-left"
                      class="w-8 h-8"
                    />
                  </div>
                  <div class="relative w-full h-10 bg-gray-800 rounded-full">
                    <div
                      v-for="item in videoTimeSlotsPersentage"
                      :key="item"
                      class="absolute left-0 top-0 h-full rounded-full cursor-pointer"
                      :class="{
                        'bg-green-500': item.index === videoResultIndex,
                        'bg-white': item.index !== videoResultIndex,

                      }"
                      :style="{
                        left: `${item.start}%`,
                        width: `${item.width}%`,
                      }"
                      @click="setVideoResultIndex({
                        index: item.index,
                        results: taskResults,
                      })"
                    />
                  </div>
                  <div
                    class="flex items-center cursor-pointer"
                    :class="{
                      'invisible': videoProgressBarTimeSlot
                        .startTime === videoProgressBarInfo?.maxStartTime
                    }"
                    @click="setProgressBar({
                      startTime: videoProgressBarTimeSlot.startTime + 1 * 60 * 60 * 1000,
                      results: taskResults,
                    })"
                  >
                    <AppSvgIcon
                      name="icon-chevron-right"
                      class="w-8 h-8"
                    />
                  </div>
                </div>
              </div>
            </template>

            <template #grow>
              <ResultVideo
                :video-url="videoUrl"
                :duration="videoDuration"
                @on-prev="prevVideo"
                @on-next="nextVideo"
              />
            </template>
          </FullLayout>
        </div>
      </template>
    </FullLayout>
  </ProgressBarLayout>

  <PrintPdf
    :form="pdfForm"
    :task="selectedTask"
    :results="selectedResults"
  />
</template>

<script setup>
import {
  computed, ref, watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useDevices from '@/stores/devices';
import useUserStore from '@/stores/user';

import NavigationBar from '@/modules/investigation/components/NavigationBar.vue';
import ResultVideo from '@/modules/investigation/components/ResultVideo.vue';
import PrintPdf from '@/modules/investigation/components/PrintPdf.vue';
import useStore from '@/modules/investigation/stores/index';
import useVideo from '@/modules/investigation/composable/video';

const devicesStore = useDevices();
const { findDevice } = devicesStore;

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { selectedTask, pdfForm } = storeToRefs(store);
const { setModal } = store;

const {
  videoResultIndex,
  videoResult,
  videoDuration,
  videoUrl,
  setVideoResultIndex,
  prevVideo,
  nextVideo,

  videoProgressBarInfo,
  videoProgressBarTimeSlot,
  videoTimeSlotsPersentage,
  setProgressBar,
} = useVideo();

const targetDevice = computed(() => findDevice(selectedTask.value.target.camera_id));
const taskResults = ref([]);
const targetScore = ref(0.8);
watch(targetScore, async (newScore) => {
  await setTaskResults(newScore);
  setVideoResultIndex({ index: 0, results: taskResults.value });
}, { immediate: true });

async function setTaskResults(score) {
  ({ result: taskResults.value } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/gettaskresultAll`,
    method: 'get',
    headers: { sessionId: sessionId.value },
    params: {
      task_id: selectedTask.value.task_id,
      score,
      Idx: 0,
    },
  }));
}

const selectedResultIndexes = ref([]);
function handleSelectAll() {
  if (selectedResultIndexes.value.length === taskResults.value.length) {
    selectedResultIndexes.value = [];
  } else {
    selectedResultIndexes.value = Array.from(
      { length: taskResults.value.length },
      (_, index) => index,
    );
  }
}
const selectedResults = computed(() => taskResults.value.filter(
  (_, index) => (selectedResultIndexes.value.includes(index)),
));

function handlePdfExport() {
  setModal('pdf');
}

</script>
