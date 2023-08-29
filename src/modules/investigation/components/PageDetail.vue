<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="flex h-full font-thin">
          <div class="w-144 border-r-2 border-gray-500">
            <FullLayout>
              <template #header>
                <div class="py-6 px-4 text-white text-2xl">
                  <div class="mb-4">
                    {{ $t("Target") }}
                  </div>
                  <div class="flex">
                    <img
                      class="w-24 h-24 mr-5"
                      :src="spiderman.base64Image.getSrc(selectedTask.target_face_image)"
                      alt=""
                    >
                    <div class="flex-grow text-xl truncate">
                      <div class="mb-2 truncate">
                        {{ targetDevice.name }}
                      </div>
                      <div class="mb-2 truncate">
                        {{ spiderman.dayjs(selectedTask.target.timestamp)
                          .format('YYYY/MM/DD HH:mm:ss') }}
                      </div>
                    </div>
                    <AppSvgIcon
                      name="icon-add-to-album"
                      class="w-10 h-10"
                      @click="setModal('save-to-album')"
                    />
                  </div>
                </div>

                <AppDivider />

                <div class="border-gray-500 py-6 px-4 text-white">
                  <div class="mb-4 text-2xl">
                    Incident List
                  </div>

                  <div class="flex">
                    <div class="w-32 px-2 flex items-center justify-end text-xl">
                      {{ $t("TargetScore") }}：
                    </div>
                    <div class="text-xl">
                      0.5
                    </div>
                    <div class="mx-3 flex-grow flex items-center">
                      <input
                        type="range"
                        class="w-full h-1
                              rounded-full appearance-none cursor-pointer
                              bg-progress-bar accent-gray-300"
                        v-model="targetScore"
                        :min="0.5"
                        :max="1"
                        :step="0.05"
                      >
                    </div>
                    <div class="text-xl">
                      1.0
                    </div>
                  </div>
                </div>

                <div class="mx-4">
                  <AppDivider />
                </div>

                <div class="flex my-4 px-4 text-white text-xl">
                  <AppCheckBox
                    class="mr-4"
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
                  class="flex px-4"
                >
                  <AppCheckBox
                    class="mt-10 mr-4"
                    v-model:modelInput="selectedResultIndexes"
                    :value="index"
                  />
                  <div
                    class="relative
                    flex-grow border-l-4 border-progress-bar
                    pb-10
                    text-white text-xl cursor-pointer"
                    @click="setVideoResultIndex({
                      index,
                      results: taskResults,
                      range,
                    })"
                    :id="`result-${index}`"
                  >
                    <div class="mb-2 ml-8 truncate text-base">
                      {{ spiderman.dayjs(result.highest.timestamp)
                        .format('YYYY/MM/DD HH:mm:ss') }}
                    </div>

                    <div
                      class="absolute -left-2.5 w-4 h-4 mt-2 rounded-full"
                      :class="{
                        'border-2 border-white':index === videoResultIndex,
                        'bg-live-channel': result.resultFrom === 'LIVE',
                        'bg-archive-channel': result.resultFrom === 'PLAYBACK',
                      }"
                    />

                    <div
                      class="rounded-full
                      flex mb-4 ml-4 py-1 px-4
                      text-sm text-white"
                      :class="{
                        'border-2 border-white':index === videoResultIndex,
                        'bg-live-channel': result.resultFrom === 'LIVE',
                        'bg-archive-channel': result.resultFrom === 'PLAYBACK',
                      }"
                    >
                      <div>
                        {{ findDevice(result.highest.cid).name }}
                      </div>
                    </div>

                    <div
                      class="flex justify-between"
                    >
                      <img
                        class="w-24 h-24 ml-8"
                        :src="spiderman.base64Image.getSrc(result.highest.face_image)"
                        alt=""
                      >
                      <AppSvgIcon
                        name="icon-add-to-album"
                        class="w-10 h-10 mr-4"
                      />
                    </div>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="py-4 px-4 text-sm">
                  <AppDivider class="mb-4" />
                  <div class="aira-row-auto-2 gap-4">
                    <AppButton
                      @click="handlePdfExport"
                      type="secondary"
                      :is-enable="selectedResultIndexes.length > 0"
                      class="py-3"
                    >
                      {{ $t("PdfExport") }}
                    </AppButton>
                    <AppButton
                      type="secondary"
                      :is-enable="selectedResultIndexes.length > 0"
                      class="py-3"
                    >
                      {{ $t("AddToCase") }}
                    </AppButton>
                    <AppButton
                      @click="handleVmsBookmark"
                      type="secondary"
                      :is-enable="selectedResultIndexes.length > 0"
                      class="py-3"
                    >
                      {{ $t("VmsBookmark") }}
                    </AppButton>
                    <AppButton
                      type="secondary"
                      :is-enable="selectedResultIndexes.length > 0"
                      class="py-3"
                    >
                      {{ $t("HtmlVideoArchive") }}
                    </AppButton>
                  </div>
                </div>
              </template>
            </FullLayout>
          </div>

          <FullLayout>
            <template #header>
              <div class="mx-4 my-8 flex justify-between text-white text-2xl">
                <div class="mr-8">
                  {{
                    videoResult
                      ? findDevice(videoResult.highest.cid).name
                      : '-'
                  }}
                </div>
                <div>
                  {{
                    videoResult
                      ? spiderman.dayjs(videoResult.highest.timestamp)
                        .format('YYYY/MM/DD HH:mm:ss')
                      : '-'
                  }}
                </div>
              </div>
            </template>

            <template #grow>
              <ResultVideo
                :video-url="videoUrl"
                :duration="videoDuration"
                @on-prev="prevVideo"
                @on-next="nextVideo"
              >
                <template
                  #select-video-bar
                  v-if="videoProgressBarTimeSlot?.startTime
                    && videoProgressBarTimeSlot?.endTime"
                >
                  <div
                    class="my-6 flex flex-col"
                  >
                    <div class="mx-4 flex justify-center text-white">
                      <div class="pr-4 whitespace-nowrap flex items-center">
                        {{ spiderman.dayjs(videoProgressBarTimeSlot.startTime)
                          .format('YYYY/MM/DD HH:mm:ss') }}
                      </div>

                      <div class="w-full flex items-center">
                        <div class="relative w-full h-5 bg-video-bar rounded-full">
                          <div
                            v-for="item in videoTimeSlotsPersentage"
                            :key="item"
                            class="absolute left-0 top-0 h-full  rounded-full cursor-pointer"
                            :class="{
                              'border-2 border-white z-10': item.index === videoResultIndex,
                              'bg-live-channel': item.resultFrom === 'LIVE',
                              'bg-archive-channel': item.resultFrom === 'PLAYBACK',
                            }"
                            :style="{
                              left: `${item.start}%`,
                              width: `${item.width}%`,
                            }"
                            @click="setVideoResultIndex({
                              index: item.index,
                              results: taskResults,
                              range,
                            })"
                          />
                        </div>
                      </div>

                      <div class="pl-4 whitespace-nowrap flex items-center">
                        {{ spiderman.dayjs(videoProgressBarTimeSlot.endTime)
                          .format('YYYY/MM/DD HH:mm:ss') }}
                      </div>
                    </div>
                  </div>
                </template>

                <template #video-bar-turn-page>
                  <div class="flex text-white">
                    <div class="flex items-center mr-8">
                      <AppButton
                        type="secondary"
                        @click="rangeZoomOut()"
                      >
                        <AppSvgIcon
                          name="icon-zoom-in"
                          class="h-8 w-8"
                        />
                      </AppButton>
                      <div class="w-20 text-center text-xl">
                        {{ rangeName }}
                      </div>
                      <AppButton
                        type="secondary"
                        @click="rangeZoomIn()"
                      >
                        <AppSvgIcon
                          name="icon-zoom-out"
                          class="h-8 w-8"
                        />
                      </AppButton>
                    </div>
                    <div
                      class="flex items-center cursor-pointer"
                      :class="{
                        'pointer-events-none text-gray-600': videoProgressBarTimeSlot
                          ?.currentPage === 1
                      }"
                      @click="turnPage(videoProgressBarTimeSlot.currentPage - 1)"
                    >
                      <AppSvgIcon
                        name="icon-chevron-left"
                        class="w-5 h-5"
                      />
                    </div>

                    <div class="flex items-center mx-6">
                      {{ videoProgressBarTimeSlot?.currentPage }}
                      /
                      {{ videoProgressBarInfo?.totalPage }}
                    </div>

                    <div
                      class="flex items-center cursor-pointer"
                      :class="{
                        'pointer-events-none text-gray-600': videoProgressBarTimeSlot
                          ?.currentPage === videoProgressBarInfo?.totalPage
                      }"
                      @click="turnPage(videoProgressBarTimeSlot.currentPage + 1)"
                    >
                      <AppSvgIcon
                        name="icon-chevron-right"
                        class="w-5 h-5"
                      />
                    </div>
                  </div>
                </template>
              </ResultVideo>
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

  <ModalPdfForm />

  <ModalBookmarkForm
    @confirm="addVmsBookmark"
  />

  <ModalSaveToAlbum
    @add="handleAddToAlbum"
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
import successStore from '@/stores/success';

import NavigationBar from '@/modules/investigation/components/NavigationBar.vue';
import ResultVideo from '@/modules/investigation/components/ResultVideo.vue';
import PrintPdf from '@/modules/investigation/components/PrintPdf.vue';
import ModalPdfForm from '@/modules/investigation/components/ModalPdfForm.vue';
import ModalBookmarkForm from '@/modules/investigation/components/ModalBookmarkForm.vue';

import useStore from '@/modules/investigation/stores/index';
import useVideo from '@/modules/investigation/composable/video';
import ModalSaveToAlbum from '@/modules/investigation/components/ModalSaveToAlbum.vue';
import { AppButton, AppDivider, AppSvgIcon } from '../../../components/app';

const devicesStore = useDevices();
const { findDevice } = devicesStore;

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { selectedTask, pdfForm, bookmarkForm } = storeToRefs(store);
const { setModal, setBookmarkForm } = store;

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
  turnPage,
} = useVideo();
const rangeIndexes = ref(['10 m', '30 m', '1 hr', '3 hr', '6 hr', '12 hr', '24 hr']);
const ranges = {
  '10 m': 10 * 60 * 1000,
  '30 m': 30 * 60 * 1000,
  '1 hr': 1 * 60 * 60 * 1000,
  '3 hr': 3 * 60 * 60 * 1000,
  '6 hr': 6 * 60 * 60 * 1000,
  '12 hr': 12 * 60 * 60 * 1000,
  '24 hr': 24 * 60 * 60 * 1000,
};
const rangeName = ref('1 hr');
const range = computed(() => ranges[rangeName.value]);
function rangeZoomIn() {
  const index = rangeIndexes.value.findIndex((i) => i === rangeName.value);
  if (index === 0) return;
  rangeName.value = rangeIndexes.value[index - 1];
}
function rangeZoomOut() {
  const index = rangeIndexes.value.findIndex((i) => i === rangeName.value);
  if (index === rangeIndexes.value.length - 1) return;
  rangeName.value = rangeIndexes.value[index + 1];
}

const targetDevice = computed(() => findDevice(selectedTask.value.target.camera_id));
const taskResults = ref([]);
const targetScore = ref(0.8);
watch(targetScore, async (newScore) => {
  await setTaskResults(newScore);
  setVideoResultIndex({ index: 0, results: taskResults.value, range: range.value });
}, { immediate: true });

watch(range, (newRange) => {
  setVideoResultIndex({
    index: videoResultIndex.value,
    results: taskResults.value,
    range: newRange,
  });
});

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

async function handleVmsBookmark() {
  setBookmarkForm({
    firstResult: {
      deviceName: findDevice(selectedResults.value[0].highest.cid).name,
      faceImage: selectedResults.value[0].highest.face_image,
      timestamp: selectedResults.value[0].highest.timestamp,
    },
    resultLength: selectedResults.value.length,
    description: '',
  });
  setModal('bookmark');
}

async function addVmsBookmark() {
  setModal('');

  const results = await Promise.allSettled(selectedResults.value.map(async (result) => {
    const { message } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/addBookmark`,
      method: 'post',
      headers: { sessionId: sessionId.value },
      data: {
        datatime: result.highest.timestamp,
        camera_id: result.highest.cid,
        caption: 'airaTracker Event',
        description: bookmarkForm.value.description,
      },
    });

    return { message };
  }));

  if (results.some(({ status }) => status !== 'fulfilled')) return;
  successStore.show();
}

async function handleAddToAlbum(form) {
  const { albumId } = form;
  const { target_face_image: faceImage, feature } = selectedTask.value;
  const data = {
    albumId,
    id: spiderman.uuid(),
    face_image: faceImage,
    feature,
  };

  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photoFeature`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data,
  });
  setModal('');
  successStore.show();
}
</script>
