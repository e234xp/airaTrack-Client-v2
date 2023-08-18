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
                <div class="mb-6 px-6 text-white text-3xl">
                  <AppCheckBox
                    class="mx-4"
                    :placeholder="$t('SelectAll')"
                  />
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
                  />
                  <div
                    class="flex-grow border-4 border-double rounded
                    flex text-white text-xl cursor-pointer"
                    :class="{
                      'bg-gradient-to-br from-green-600 to-green-900':index===videoResultIndex
                    }"
                    @click="setVideoResultIndex(index)"
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

          <div class="flex-grow">
            <div class="m-4 flex text-white text-4xl">
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
            <div class="flex justify-center">
              <ResultVideo
                :video-url="videoUrl"
                :duration="videoDuration"
                @on-prev="prevVideo"
                @on-next="nextVideo"
              />
            </div>
          </div>
        </div>
      </template>
    </FullLayout>
  </ProgressBarLayout>
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
import useStore from '@/modules/investigation/stores/index';

const devicesStore = useDevices();
const { livedevices, devices } = storeToRefs(devicesStore);

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { selectedTask } = storeToRefs(store);

const targetDevice = computed(() => findDevice(selectedTask.value.target.camera_id));

const taskResults = ref([]);
const targetScore = ref(0.8);
watch(targetScore, async (newScore) => {
  await setTaskResults(newScore);
  setVideoResultIndex(0);
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

const videoResultIndex = ref(null);
const videoResult = ref(null);
const videoDuration = ref(null);
const videoUrl = ref(null);
function setVideoResultIndex(i) {
  videoResultIndex.value = i;
  videoResult.value = taskResults.value[i];
  videoDuration.value = (videoResult.value.endtime - videoResult.value.starttime) / 1000;
  videoUrl.value = getVideoUrl(videoResult.value);
}

function getVideoUrl(result) {
  if (!result) return '';

  const {
    starttime: startTime, endtime: endTime,
    highest: { cid: cameraId },
  } = result;
  return `${spiderman.system.apiBaseUrl}/airaTracker/viewmedia?sessionId=${sessionId.value}&camera_id=${cameraId}&start_time=${startTime}&end_time=${endTime}`;
}

function prevVideo() {
  if (videoResultIndex.value === 0) {
    setVideoResultIndex(taskResults.value.length - 1);
    return;
  }
  setVideoResultIndex(videoResultIndex.value - 1);
}

function nextVideo() {
  if (videoResultIndex.value === taskResults.value.length - 1) {
    setVideoResultIndex(0);
    return;
  }
  setVideoResultIndex(videoResultIndex.value + 1);
}

function findDevice(id) {
  return livedevices.value
    .find((device) => device.camera_id === id)
  ?? devices.value
    .find((device) => device.camera_id === id);
}
</script>
