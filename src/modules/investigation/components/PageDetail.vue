<template>
  <ProgressBarLayout>
    <FullLayout>
      <!-- <template #header>
        <NavigationBar />
      </template> -->

      <template #grow>
        <div class="flex h-full font-thin">
          <div class="border-r border-gray-600">
            <FullLayout class="!w-128">
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
                      class="w-24 h-24 mr-4 rounded"
                      :src="spiderman.base64Image.getSrc(selectedTask.target_face_image)"
                      alt=""
                    >
                    <div class="flex flex-col justify-between" style="width: calc(100% - 7rem)">
                      <div class="flex w-full gap-2">
                        <div class="text-base" style="width: calc(100% - 2.5rem)">
                          <div class="flex items-center gap-2">
                            <AppSvgIcon name="icon-camera" class="w-4 h-4" />
                            <div class="truncate" style="width: calc(100% - 1.5rem)">{{ targetDevice.name }}</div>
                          </div>
                          <div class="flex items-center gap-2">
                            <AppSvgIcon name="icon-calendar" class="w-4 h-4" />
                            <div class="truncate" style="width: calc(100% - 1.5rem)">{{ `${spiderman.formatDate.parseYMD(selectedTask.target.timestamp)} ${spiderman.dayjs(selectedTask.target.timestamp).format('HH:mm:ss')}` }}</div>
                          </div>
                        </div>
                        <AppButton type="secondary"
                          @click="addTaskToAlbum"
                          class="w-8 h-8 !p-0">
                          <AppSvgIcon name="icon-add-to-album" class="text-white w-8 h-8" />
                        </AppButton>
                      </div>
                      <div class="flex w-full">
                        <div class="flex items-center text-base" v-if="!fromCase">
                          {{ $t("TargetScore") }}：
                        </div>
                        <template v-if="!fromCase">
                          <div class="text-base">
                            0.5
                          </div>
                          <div class="relative mx-3 flex-grow flex items-center">
                            <div class="absolute text-primary font-bold text-center text-lg" :style="scoreHintStyle">
                              {{ targetScore === '1' ? targetScore + '.0' : targetScore }}
                            </div>
                            <input
                              type="range"
                              class="w-full h-1
                                    rounded-full appearance-none cursor-pointer
                                    accent-gray-300"
                              :style="inputRangeStyle"
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
                          <!-- <div class="text-base">
                            {{ selectedTask.target_score }}
                          </div> -->
                        </template>
                      </div>
                    </div>
                  </div>
                </div>

                <AppDivider />

                <div class="w-full flex gap-2 justify-between mt-4 mb-2 px-4 text-white text-base">
                  <AppCheckBox
                    class="!w-1/2"
                    :placeholder="$t('SelectAll')"
                    :checked="selectedAll"
                    :disabled="taskResults.length === 0"
                    @on-change="handleSelectAll"
                  >{{ $t('SelectAll') }} ({{ selectedResults.length }})</AppCheckBox>
                  <div class="flex gap-2 items-center" v-if="pagination.total_length">
                    <div class="mr-2">
                      <span v-if="pagination.start + 1 !== pagination.end">{{ pagination.start + 1 }} - {{ pagination.end }}</span> <span v-if="pagination.total_pages > 1">/ {{ pagination.total_length }}</span>
                    </div>
                    <AppSvgIcon
                      name="icon-chevron-left"
                      class="w-4 h-4"
                      :class="{
                        'text-gray-600': currentPage === 1 || taskResults.length === 0,
                        'cursor-pointer': currentPage !== 1,
                      }"
                      @click="onPrevPage"
                    />
                    <AppSvgIcon
                      name="icon-chevron-right"
                      class="w-4 h-4"
                      :class="{
                        'text-gray-600': currentPage >= pagination.total_pages || taskResults.length === 0,
                        'cursor-pointer': currentPage < pagination.total_pages,
                      }"
                      @click="onNextPage"
                    />
                  </div>
                </div>
              </template>

              <template #grow>
                <template v-if="taskResults.length === 0 && (targetScore === '1' ? scoreCount['1.0'] : scoreCount[targetScore]) !== 0">
                  <div
                    v-for="result in 4"
                    :key="result"
                    class="flex pl-4 pr-2"
                  >
                    <AppCheckBox
                      class="mt-3 mr-2 !w-6 h-4"
                      disabled
                    />
                    <div
                      class="task relative
                      flex-grow border-l-4 border-general
                      pb-2
                      text-white text-xl cursor-pointer"
                    >
                      <div
                        class="absolute -left-2.5 w-4 h-4 mt-3 rounded-full border-2 border-transparent bg-live-channel"
                      />

                      <div
                        class="con flex gap-2 ml-4 p-2 border-2 rounded border-transparent animate-pulse"
                      >
                        <div class="w-24 h-24 rounded bg-label"></div>
                        <div class="hint text-base text-default">
                          <div class="truncate w-full h-4 bg-label mb-2"></div>
                          <div class="truncate w-3/4 h-4 bg-label"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="text-white text-2xl m-auto" v-if="taskResults.length === 0 && (targetScore === '1' ? scoreCount['1.0'] : scoreCount[targetScore]) === 0">
                    {{ $t('NoData') }}
                  </div>
                  <div
                    v-for="(result, index) in taskResults"
                    :key="index"
                    class="flex pl-4 pr-2"
                  >
                    <AppCheckBox
                      class="mt-3 mr-2 !w-6 h-4"
                      v-model:modelInput="selectedResultIds"
                      :value="result.ids[0]"
                    />
                    <div
                      class="task relative
                      flex-grow border-l-4 border-general
                      pb-2
                      text-white text-xl cursor-pointer"
                      @click="setVideoResultIndex({
                        index,
                        results: taskResults,
                        range,
                      })"
                      :id="`result-${index}`"
                    >
                      <div
                        class="absolute -left-2.5 w-4 h-4 mt-3 rounded-full border-2 border-transparent"
                        :class="{
                          'border-2 border-white':index === videoResultIndex,
                          'bg-live-channel': result.resultFrom === 'LIVE',
                          'bg-archive-channel': result.resultFrom === 'PLAYBACK',
                        }"
                      />

                      <div
                        class="con flex gap-2 ml-4 p-2 border-2 rounded border-transparent"
                        :class="{
                          '!border-live-channel':index === videoResultIndex && result.resultFrom === 'LIVE',
                          '!border-archive-channel':index === videoResultIndex && result.resultFrom === 'PLAYBACK',
                        }"
                      >
                        <img
                          class="w-24 h-24 rounded"
                          v-lazy="spiderman.base64Image.getSrc(result.highest.face_image)"
                          alt=""
                        >
                        <div class="hint text-base text-default">
                          <div class="truncate">
                            {{ `${spiderman.formatDate.parseYMD(result.highest.timestamp)} ${spiderman.dayjs(result.highest.timestamp).format('HH:mm:ss')}` }}
                          </div>
                          <div class="truncate">
                            {{ findDevice(result.highest.cid).name }}
                          </div>
                        </div>

                        <AppButton type="secondary"
                          @click.stop="addTargetToAlbum(result)"
                          class="btn w-8 h-8 ml-auto !p-0 z-10">
                          <AppSvgIcon name="icon-add-to-album" class="text-white w-8 h-8" />
                        </AppButton>
                      </div>
                    </div>
                  </div>
                </template>
              </template>

              <template #footer>
                <AppDivider class="mt-4" />

                <div class="grid grid-cols-2 grid-rows-2 p-4 gap-2">
                  <AppButton
                    @click="handlePdfExport"
                    type="secondary"
                    :is-enable="selectedResults.length > 0"
                  >
                    {{ $t("PdfExport") }}
                  </AppButton>
                  <AppButton
                    type="secondary"
                    @click="handleAddCase"
                    :is-enable="selectedResults.length > 0"
                  >
                    {{ $t("AddToCase") }}
                  </AppButton>
                  <AppButton
                    @click="handleVmsBookmark"
                    type="secondary"
                    :is-enable="selectedResults.length > 0"
                  >
                    {{ $t("VmsBookmark") }}
                  </AppButton>
                  <AppButton
                    @click="handleVideoArchive"
                    type="secondary"
                    :is-enable="selectedResults.length > 0"
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
                <!-- <div>
                  {{
                    videoResult
                      ? `${spiderman.formatDate.parseYMD(videoResult.highest.timestamp)} ${spiderman.dayjs(videoResult.highest.timestamp).format('HH:mm:ss')}`
                      : '-'
                  }}
                </div> -->
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
                <template #timestamp>
                  {{
                    videoResult
                      ? `${spiderman.formatDate.parseYMD(videoResult.highest.timestamp)} ${spiderman.dayjs(videoResult.highest.timestamp).format('HH:mm:ss')}`
                      : '-'
                  }}
                </template>
                <template
                  #select-video-bar
                  v-if="videoProgressBarTimeSlot?.startTime
                    && videoProgressBarTimeSlot?.endTime"
                >
                  <div
                    class="my-4 flex flex-col"
                  >
                    <div class="flex justify-center text-white">
                      <div class="pr-4 whitespace-nowrap flex items-center">
                        {{ `${spiderman.formatDate.parseYMD(videoProgressBarTimeSlot.startTime)} ${spiderman.dayjs(videoProgressBarTimeSlot.startTime).format('HH:mm')}` }}
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
                        {{ `${spiderman.formatDate.parseYMD(videoProgressBarTimeSlot.endTime)} ${spiderman.dayjs(videoProgressBarTimeSlot.endTime).format('HH:mm')}` }}
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
    :list="albums"
    @add="handleAddToAlbum"
  />

  <ModalAddCase :list="caseList" @add="onAddCase" @append="onAppendCase" />

  <ModalVideoArchiveForm @add="onAddVideoArchive" @retry="onRetryVideoArchive" @delete="onDeleteVideoArchiveItem" />
</template>

<script setup>
import {
  computed, ref, watch, reactive, onBeforeMount
} from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import successStore from '@/components/AppSuccess/success';

import ResultVideo from '@/modules/investigation/components/ResultVideo.vue';
import PrintPdf from '@/modules/investigation/components/PrintPdf.vue';
import ModalPdfForm from '@/modules/investigation/components/ModalPdfForm.vue';
import ModalBookmarkForm from '@/modules/investigation/components/ModalBookmarkForm.vue';
import ModalVideoArchiveForm from '@/modules/investigation/components/ModalVideoArchiveForm.vue';
import ModalAddCase from '@/modules/investigation/components/ModalAddCase.vue';
import ModalSaveToAlbum from '@/modules/investigation/components/ModalSaveToAlbum.vue';

import useConfig from '@/modules/config/stores/index';
import useStore from '@/modules/investigation/stores/index';
import useTarget from '@/modules/target/stores/index';
import useCase from '@/modules/case/stores/index';
import useVideo from '@/modules/investigation/composable/video';
import useAlbums from '@/stores/albums';
import useDevices from '@/stores/devices';
import useUser from '@/stores/user';

import downloadReport from '@/modules/investigation/composable/archive';

const devicesStore = useDevices();
const { findDevice } = devicesStore;

const store = useStore();
const { selectedTask, pdfForm, bookmarkForm, archiveForm, fromCase, dataType } = storeToRefs(store);
const { setModal, setBookmarkForm, setPdfForm, setArchiveForm, setSelectedExport, 
  getTaskResultAll, addBookmark, addCase, putCase } = store;
const { setPage, setDataType, startDownload, batchDownloadVideo, deleteDownloadVideo } = store;

const targetStore = useTarget();
const { addPhotoFeature } = targetStore;

const albumsStore = useAlbums();
const { albums } = storeToRefs(albumsStore);

const { getTrackConfig } = useConfig();

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

const { startAddtoCase, finishAddtoCase } = useUser();

const { getCase } = useCase();

const video = ref(null);
const printPdf = ref(null);
const serverAddress = ref('');
const authKey = ref(null);
const timerId = ref(0);

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

const scoreHintStyle = computed({
  get: () => {
    const newVal = ((targetScore.value - 0.5) / 0.5) * 100;
    const newPos = 8 - (newVal * 0.16);
    return {
      top: '-80%',
      transform: 'translate(-50%, 0)',
      width: '40px',
      left: `calc(${newVal}% + (${newPos}px))`
    }
  }
})

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

const scoreCount = ref({});

const pageCount = ref(50);
const pagination = ref({});
const currentPage = ref(1);

const caseList = ref([]);

const targetDevice = computed(() => findDevice(selectedTask.value.target.camera_id));
const taskResults = ref([]);
const targetScore = ref(0);
watch(targetScore, async (newScore, oldScore) => {
  if (newScore === 0) return;
  currentPage.value = 1;
  await setTaskResults(newScore, +newScore > +oldScore);
}, { immediate: true });

watch(range, (newRange) => {
  setVideoResultIndex({
    index: videoResultIndex.value,
    results: taskResults.value,
    range: newRange,
  });
});

async function setTaskResults(score, filter = false) {
  timerId.value = setTimeout(() => {
    taskResults.value = [];
  }, 500);
  if (!fromCase.value) {
    ({ result: taskResults.value, score_count: scoreCount.value, pagination: pagination.value } = await getTaskResultAll(selectedTask.value.task_id, score, ((currentPage.value - 1) * pageCount.value)));
    if (filter) filterTaskResults();
    clearTimeout(timerId.value);
  } else {
    taskResults.value = selectedTask.value.facesData;
    clearTimeout(timerId.value);
  }
  if (taskResults.value.length !== 0) setVideoResultIndex({ index: 0, results: taskResults.value, range: range.value });
}

const scoreDistributed = computed({
  get: () => {
    const list = [];
    const primary = 'rgba(44, 119, 160, #)';
    const keys = Object.keys(scoreCount.value);
    const count = keys.length;
    const sum = scoreCount.value[keys[0]];
    Object.keys(scoreCount.value).forEach((key, idx) => {
      const val = scoreCount.value[key];
      list.push(`${primary.replace('#', sum === 0 ? 0 : (val / sum))} ${(idx / count) * 100}%`);
    })
    return list;
  }
})

const inputRangeStyle = computed({
  get: () => {
    return {
      height: '0.5rem',
      background: 'rgba(255, 255, 255, 0.6)',
      backgroundImage: `linear-gradient(to right, ${scoreDistributed.value.join(',')})`
    }
  } 
})

// const selectedResultIds = ref([]);
const selectedResults = ref([]);
function handleSelectAll() {
  if (selectedAll.value) {
    taskResults.value.forEach((item) => {
      const id = item.ids[0];
      const idx = selectedResultIds.value.indexOf(id);
      if (idx >= 0) selectedResults.value.splice(idx, 1);
    })
  } else {
    taskResults.value.forEach((item) => {
      const id = item.ids[0];
      const idx = selectedResultIds.value.indexOf(id);
      if (idx < 0) selectedResults.value.push(item);
    })
  }
}

function filterTaskResults() {
  const list = [];
  taskResults.value.forEach((item) => {
    const id = item.ids[0];
    const idx = selectedResultIds.value.indexOf(id);
    if (idx >= 0) list.push(item);
  })
  selectedResults.value = list;
}

const selectedResultIds = computed({
  get: () => {
    return selectedResults.value.map((item) => item.ids[0]);
  },
  set: (val) => {
    const addList = val.filter((item) => selectedResultIds.value.indexOf(item) < 0);
    const delList = selectedResultIds.value.filter((item) => val.indexOf(item) < 0);
    
    if (addList.length > 0) {
      addList.forEach((id) => {
        const item = taskResults.value.find((item) => item.ids[0] === id);
        if (item) selectedResults.value.push(item);
      })
    }

    if (delList.length > 0) {
      delList.forEach((id) => {
        const idx = selectedResults.value.findIndex((item) => item.ids[0] === id);
        if (idx >= 0) selectedResults.value.splice(idx, 1);
      })
    }
  }
})

const selectedAll = computed({
  get: () => {
    return taskResults.value.every((item) => selectedResultIds.value.indexOf(item.ids[0]) >= 0);
  }
})

function handleExportItem() {
  const temp = selectedResults.value.find((item) => item.highest.feature === selectedTask.value.feature);
  const first = temp || selectedResults.value[0];
  setSelectedExport({
    firstResult: {
      deviceName: findDevice(first.highest.cid).name,
      faceImage: first.highest.face_image,
      timestamp: first.highest.timestamp,
    },
    resultLength: selectedResults.value.length
  })
}

function handlePdfExport() {
  handleExportItem();
  setPdfForm({
    title: 'Investigation Report',
    subject: 'Subject',
    remark: '',
  });
  setModal('pdf');
}

async function handleVmsBookmark() {
  handleExportItem();
  setBookmarkForm({
    description: '',
  });
  setModal('bookmark');
}

async function addVmsBookmark() {
  setModal('');

  const results = await Promise.allSettled(selectedResults.value.map(async (result) => {
    const { message } = await addBookmark(result.highest.timestamp, result.highest.cid, `${findDevice(result.highest.cid).name}\n${bookmarkForm.value.description}`);
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
  handleExportItem();
  ({ data: caseList.value } = await getCase());
  setModal('case');
}

async function onAddCase(param) {
  startAddtoCase();
  const { message, caseId } = await addCase({...param, score: targetScore.value});
  if (message === 'ok') {
    await handelAppendCase(caseId);
  }
}

async function onAppendCase(param) {
  startAddtoCase();
  await handelAppendCase(param.caseId);
}

async function handelAppendCase(caseId) {
  for (const data of selectedResults.value) {
    await putCase({caseId, data});
  }
  setModal('');
  successStore.show();
  finishAddtoCase();
}

async function handleVideoArchive() {
  handleExportItem();
  setArchiveForm({
    title: 'Investigation Report',
    subject: 'Subject',
    remark: '',
  });
  setModal('archive');
}

async function onAddVideoArchive() {
  startDownload();
  batchDownloadVideo(selectedResults.value, false, () => {
    downloadReport(archiveForm.value, selectedTask.value.task_name, selectedResults.value, selectedTask.value.target.timestamp, selectedTask.value.target_face_image, selectedTask.value.search_start_time, selectedTask.value.search_end_time);  
  });
}

async function onRetryVideoArchive() {
  startDownload();
  batchDownloadVideo(selectedResults.value, true, () => {
    downloadReport(archiveForm.value, selectedTask.value.task_name, selectedResults.value, selectedTask.value.target.timestamp, selectedTask.value.target_face_image, selectedTask.value.search_start_time, selectedTask.value.search_end_time);  
  });
}

async function onDeleteVideoArchiveItem(item) {
  const id = item.ids[0];
  const idx = selectedResults.value.findIndex((item) => item.ids[0] === id);
  if (idx >= 0) selectedResults.value.splice(idx, 1);
  deleteDownloadVideo(id);
  if (selectedResults.value.length === 0) setModal('');
}

async function onSnapshot() {
  const videoTime = video.value.getCurrentTime();
  const time = Math.floor(videoResult.value.starttime + (videoTime * 1000)) - 100;
  const imageUrl = getSnapshotUrl({ cameraId: videoResult.value.highest.cid, time });
  const link = document.createElement('a');
  const response = await fetch(imageUrl);
  const file = await response.blob();
  link.href = URL.createObjectURL(file);
  link.download = `${selectedTask.value.task_name}_${findDevice(videoResult.value.highest.cid).name}_${spiderman.dayjs(time).format('YYYYMMDDHHmmss')}.png`;
  link.click();
}

async function onVideoArchive() {
  const response = await fetch(videoUrl.value);
  const file = await response.blob();
  const link = document.createElement('a');
  link.href = URL.createObjectURL(file);
  link.download = `${selectedTask.value.task_name}_${spiderman.formatDate.today().split(' ').join('')}`; //or any other extension
  link.click();
}

function onPrevPage() {
  if (taskResults.value.length === 0) return;
  if (currentPage.value > 1) {
    currentPage.value -= 1;
    setTaskResults(targetScore.value);
  }
}

function onNextPage() {
  if (taskResults.value.length === 0) return;
  if (currentPage.value < pagination.value.total_pages) {
    currentPage.value += 1;
    setTaskResults(targetScore.value);
  }
}

onBeforeMount(async () => {
  ({ face_merge_score: targetScore.value } = await getTrackConfig());
})
</script>

<style lang="scss">
.btn {
  display: none;
}

.hint {
  width: calc(100% - 6.5rem);
}

.task:hover {
  .btn {
    display: flex;
  }

  .con {
    border-color: theme('colors.general');
  }

  .hint {
    width: calc(100% - 9rem);
  }
}
</style>