<template>
  <ProgressBarLayout>
    <FullLayout>
      <!-- <template #header>
        <NavigationBar />
      </template> -->

      <template #grow>
        <div class="flex h-full font-thin">
          <div class="w-160 border-r border-gray-600">
            <FullLayout>
              <template #header>
                <div class="px-4 pt-2 pb-4 flex items-center gap-4">
                  <AppButton
                    type="secondary"
                    class="w-8 h-8 !p-0"
                    @click="
                      setPage('list');
                      setDataType(dataType);
                    "
                  >
                    <AppSvgIcon name="icon-chevron-left" class="text-white w-4 h-4" />
                  </AppButton>
                  <div class="text-white text-xl">{{ selectedTask.task_name }}</div>
                </div>
                <div class="px-4 pb-4 text-white text-xl">
                  <div class="flex">
                    <img
                      class="w-24 h-24 mr-4"
                      :src="spiderman.base64Image.getSrc(selectedTask.target_face_image)"
                      alt=""
                    >
                    <div class="flex flex-col justify-between" style="width: calc(100% - 7rem)">
                      <div class="flex">
                        <div class="flex-grow text-base truncate">
                          <div class="truncate">
                            {{ targetDevice.name }}
                          </div>
                          <div class="truncate">
                            {{ `${spiderman.formatDate.parseStr(selectedTask.target.timestamp)} ${spiderman.dayjs(selectedTask.target.timestamp).format('HH:mm:ss')}` }}
                          </div>
                        </div>
                        <AppButton type="secondary"
                          @click="addTaskToAlbum"
                          class="w-8 h-8 ml-auto !p-0">
                          <AppSvgIcon name="icon-add-to-album" class="text-white w-8 h-8" />
                        </AppButton>
                      </div>
                      <div class="flex w-full">
                        <div class="flex items-center text-base">
                          {{ $t("TargetScore") }}：
                        </div>
                        <template v-if="!fromCase">
                          <div class="text-base">
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
                          <div class="text-base">
                            1.0
                          </div>
                        </template>
                        <template v-else>
                          <div class="text-base">
                            {{ selectedTask.target_score }}
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- <AppDivider /> -->

                <!-- <div class="border-gray-500 py-4 px-4 text-white"> -->
                  <!-- <div class="mb-2 text-xl">
                    {{ $t('IncidentList') }}
                  </div> -->

                  <!-- <div class="flex">
                    <div class="w-32 px-2 flex items-center justify-end text-base">
                      {{ $t("TargetScore") }}：
                    </div>
                    <template v-if="!fromCase">
                      <div class="text-base">
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
                      <div class="text-base">
                        1.0
                      </div>
                    </template>
                    <template v-else>
                      <div class="text-base">
                        {{ selectedTask.target_score }}
                      </div>
                    </template>
                  </div> -->
                <!-- </div> -->

                <AppDivider />

                <div class="flex gap-2 mt-4 mb-2 px-4 text-white text-base">
                  <AppCheckBox
                    :placeholder="$t('SelectAll')"
                    :checked="selectedResultIndexes.length === taskResults.length"
                    @on-change="handleSelectAll"
                  >{{ $t('SelectAll') }} ({{ selectedResultIndexes.length }})</AppCheckBox>
                </div>
              </template>

              <template #grow>
                <div
                  v-for="(result, index) in taskResults"
                  :key="index"
                  class="flex px-4"
                >
                  <AppCheckBox
                    class="mt-4 mr-2 !w-6 h-4"
                    v-model:modelInput="selectedResultIndexes"
                    :value="index"
                  />
                  <div
                    class="relative
                    flex-grow border-l-4 border-general
                    pb-2 pt-2
                    text-white text-xl cursor-pointer"
                    @click="setVideoResultIndex({
                      index,
                      results: taskResults,
                      range,
                    })"
                    :id="`result-${index}`"
                  >
                    <div
                      class="absolute -left-2.5 w-4 h-4 mt-2 rounded-full border-2 border-transparent"
                      :class="{
                        'border-2 border-white':index === videoResultIndex,
                        'bg-live-channel': result.resultFrom === 'LIVE',
                        'bg-archive-channel': result.resultFrom === 'PLAYBACK',
                      }"
                    />

                    <div
                      class="flex rounded-full
                      mb-2 ml-4 py-1 px-4
                      text-sm text-white border-2 gap-2"
                      :class="{
                        'border-live-channel': result.resultFrom === 'LIVE',
                        'border-archive-channel': result.resultFrom === 'PLAYBACK',
                        'border-2 border-white':index === videoResultIndex
                      }"
                    >
                      <div class="w-2/5">{{ `${spiderman.formatDate.parseStr(result.highest.timestamp)} ${spiderman.dayjs(result.highest.timestamp).format('HH:mm:ss')}` }} </div> 
                      <div class="w-3/5 truncate">{{ findDevice(result.highest.cid).name }}</div>
                    </div>

                    <div
                      class="flex gap-4"
                    >
                      <img
                        class="w-24 h-24 ml-8"
                        :src="spiderman.base64Image.getSrc(result.highest.face_image)"
                        alt=""
                      >
                      <!-- <div class="truncate text-base">
                        {{ spiderman.dayjs(result.highest.timestamp)
                          .format('YYYY/MM/DD HH:mm:ss') }}
                      </div> -->
                      <AppButton type="secondary"
                        @click="addTargetToAlbum(result)"
                        class="w-8 h-8 mr-2 ml-auto !p-0">
                        <AppSvgIcon name="icon-add-to-album" class="text-white w-8 h-8" />
                      </AppButton>
                      <!-- <AppSvgIcon
                        name="icon-add-to-album"
                        class="w-10 h-10 mr-2 ml-auto hover:bg-primary-hover"
                        @click="addTargetToAlbum(result)"
                      /> -->
                    </div>
                  </div>
                </div>
              </template>

              <template #footer>
                <AppDivider class="mt-4" />

                <div class="grid grid-cols-2 grid-rows-2 p-4 gap-2">
                  <AppButton
                    @click="handlePdfExport"
                    type="secondary"
                    :is-enable="selectedResultIndexes.length > 0"
                  >
                    {{ $t("PdfExport") }}
                  </AppButton>
                  <AppButton
                    type="secondary"
                    @click="handleAddCase"
                    :is-enable="selectedResultIndexes.length > 0"
                  >
                    {{ $t("AddToCase") }}
                  </AppButton>
                  <AppButton
                    @click="handleVmsBookmark"
                    type="secondary"
                    :is-enable="selectedResultIndexes.length > 0"
                  >
                    {{ $t("VmsBookmark") }}
                  </AppButton>
                  <AppButton
                    @click="handleVideoArchive"
                    type="secondary"
                    :is-enable="selectedResultIndexes.length > 0"
                  >
                    {{ $t("HtmlVideoArchive") }}
                  </AppButton>
                </div>
              </template>
            </FullLayout>
          </div>

          <FullLayout>
            <template #header>
              <div class="mx-4 my-2 flex justify-between text-white text-xl">
                <div>
                  {{
                    videoResult
                      ? findDevice(videoResult.highest.cid).name
                      : '-'
                  }}
                </div>
                <div>
                  {{
                    videoResult
                      ? `${spiderman.formatDate.parseStr(videoResult.highest.timestamp)} ${spiderman.dayjs(videoResult.highest.timestamp).format('HH:mm:ss')}`
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
                ref="video"
              >
                <template
                  #select-video-bar
                  v-if="videoProgressBarTimeSlot?.startTime
                    && videoProgressBarTimeSlot?.endTime"
                >
                  <div
                    class="my-4 flex flex-col"
                  >
                    <div class="mx-4 flex justify-center text-white">
                      <div class="pr-4 whitespace-nowrap flex items-center">
                        {{ `${spiderman.formatDate.parseStr(videoProgressBarTimeSlot.startTime)} ${spiderman.dayjs(videoProgressBarTimeSlot.startTime).format('HH:mm:ss')}` }}
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
                        {{ `${spiderman.formatDate.parseStr(videoProgressBarTimeSlot.endTime)} ${spiderman.dayjs(videoProgressBarTimeSlot.endTime).format('HH:mm:ss')}` }}
                      </div>
                    </div>
                  </div>
                </template>

                <template #video-bar-download>
                  <AppButton type="secondary"
                    @click="onSnapshot"
                    class="w-8 h-8 !p-0">
                    <AppSvgIcon name="icon-snap" class="text-white w-8 h-8" />
                  </AppButton>
                  <AppButton type="secondary"
                    @click="onVideoArchive"
                    class="w-8 h-8 !p-0">
                    <AppSvgIcon name="icon-download" class="text-white w-8 h-8" />
                  </AppButton>
                </template>

                <template #video-bar-turn-page>
                  <div class="flex text-white">
                    <div class="flex items-center mr-8">
                      <AppButton
                        type="secondary"
                        @click="rangeZoomOut()"
                        class="!p-0"
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
                        class="!p-0"
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
    ref="printPdf"
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

  <ModalAddCase @add="onAddCase" />

  <ModalVideoArchiveForm @add="onAddVideoArchive" />
</template>

<script setup>
import {
  computed, ref, watch, reactive
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import useDevices from '@/stores/devices';
import successStore from '@/components/AppSuccess/success';

import ResultVideo from '@/modules/investigation/components/ResultVideo.vue';
import PrintPdf from '@/modules/investigation/components/PrintPdf.vue';
import ModalPdfForm from '@/modules/investigation/components/ModalPdfForm.vue';
import ModalBookmarkForm from '@/modules/investigation/components/ModalBookmarkForm.vue';
import ModalVideoArchiveForm from '@/modules/investigation/components/ModalVideoArchiveForm.vue';
import ModalAddCase from '@/modules/investigation/components/ModalAddCase.vue';
import ModalSaveToAlbum from '@/modules/investigation/components/ModalSaveToAlbum.vue';

import useStore from '@/modules/investigation/stores/index';
import useTarget from '@/modules/target/stores/index';
import useVideo from '@/modules/investigation/composable/video';
import downloadReport from '@/modules/investigation/composable/archive';

const devicesStore = useDevices();
const { findDevice } = devicesStore;

const store = useStore();
const { selectedTask, pdfForm, bookmarkForm, fromCase, dataType } = storeToRefs(store);
const { setModal, setBookmarkForm, getTaskResultAll, addBookmark, addCase, putCase } = store;
const { setPage, setDataType } = store;

const targetStore = useTarget();
const { addPhotoFeature } = targetStore;

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

  getSnapshotUrl
} = useVideo();

const video = ref(null);
const printPdf = ref(null);

const rangeList = new Map()
  .set('10 m', 10 * 60 * 1000)
  .set('30 m', 30 * 60 * 1000)
  .set('1 hr', 1 * 60 * 60 * 1000)
  .set('3 hr', 3 * 60 * 60 * 1000)
  .set('6 hr', 6 * 60 * 60 * 1000)
  .set('12 hr', 12 * 60 * 60 * 1000)
  .set('24 hr', 24 * 60 * 60 * 1000);
const rangeIndexes = Array.from(rangeList.keys());
const rangeName = ref('1 hr');
const range = computed(() => rangeList.get(rangeName.value));
function rangeZoomIn() {
  const index = rangeIndexes.findIndex((i) => i === rangeName.value);
  if (index === 0) return;
  rangeName.value = rangeIndexes[index - 1];
}
function rangeZoomOut() {
  const index = rangeIndexes.findIndex((i) => i === rangeName.value);
  if (index === rangeIndexes.length - 1) return;
  rangeName.value = rangeIndexes[index + 1];
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
  if (!fromCase.value) {
    ({ result: taskResults.value } = await getTaskResultAll(selectedTask.value.task_id, score));
  } else {
    taskResults.value = selectedTask.value.facesData;
  }
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
    const { message } = await addBookmark(result.highest.timestamp, result.highest.cid, bookmarkForm.value.description);
    return { message };
  }));

  if (results.some(({ status }) => status !== 'fulfilled')) return;
  successStore.show();
}

const albumData = reactive({
  faceImage: '',
  feature: '' 
});

function addTaskToAlbum() {
  setModal('save-to-album');
  albumData.faceImage = selectedTask.value.target_face_image;
  albumData.feature = selectedTask.value.feature;
}

function addTargetToAlbum(data) {
  setModal('save-to-album');
  albumData.faceImage = data.highest.face_image;
  albumData.feature = data.highest.feature;
}

async function handleAddToAlbum(form) {
  const { albumId } = form;
  const { faceImage, feature } = albumData;
  const data = {
    albumId,
    id: spiderman.uuid(),
    face_image: faceImage,
    feature,
  };
  await addPhotoFeature(data);
  setModal('');
  successStore.show();
}

async function handleAddCase() {
  setModal('case');
}

async function onAddCase(param) {
  const { message, caseId } = await addCase({...param, score: targetScore.value});
  if (message === 'ok') {
    for (const data of selectedResults.value) {
      await putCase({caseId, data});
    }
    setModal('');
    successStore.show();
  }
}

async function handleVideoArchive() {
  setModal('archive');
}

async function onAddVideoArchive() {
  // console.log(selectedTask.value);
  // return;
  downloadReport(pdfForm.value, selectedTask.value.task_name, selectedResults.value, selectedTask.value.target.timestamp, selectedTask.value.target_face_image, selectedTask.value.search_start_time, selectedTask.value.search_end_time);
}

async function onSnapshot() {
  const videoTime = video.value.getCurrentTime();
  const time = Math.floor(videoResult.value.starttime + (videoTime * 1000)) - 500;
  const imageUrl = getSnapshotUrl({ cameraId: selectedTask.value.target.camera_id, time });
  const link = document.createElement('a');
  const response = await fetch(imageUrl);
  const file = await response.blob();
  link.href = URL.createObjectURL(file);
  link.download = `${selectedTask.value.task_name}_${targetDevice.value.name}_${spiderman.dayjs(time).format('YYYYMMDDHHmmss')}.png`;
  link.click();
}

async function onVideoArchive() {
  const response = await fetch(videoUrl.value);
  const file = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = `${selectedTask.value.task_name}_${spiderman.formatDate.today()}`; //or any other extension
  link.click();
}
</script>
