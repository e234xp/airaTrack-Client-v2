<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div
          v-for="item in list"
          v-show="dataType === 'all' || item.data_type === dataType"
          :key="item.task_id"
          class="ml-4"
        >
          <div class="flex py-4 pl-8">
            <img
              class="w-60 h-60 mr-4"
              :src="spiderman.base64Image.getSrc(item.target_face_image)"
              alt=""
            >

            <div class="w-full flex-grow text-white text-xl">
              <div class="flex justify-around pl-4">
                <div class="w-32 mr-8 flex items-center content-center">
                  {{ item.data_type }}
                  <!-- <template v-if="item.data_type === 'stop'">
                    {{ $t('Init') }}
                  </template>
                  <template v-else-if="item.data_type === 'progress'">
                    {{ $t('Processing') }}
                  </template>
                  <template v-else-if="item.data_type === 'finish'">
                    {{ $t('Completed') }}
                  </template> -->
                </div>
                <div class="flex items-center" style="width: calc(100% - 32rem)">
                  <div class="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
                    <div
                      class="h-3.5 rounded-full"
                      :class="{
                        'bg-green-600': item.progress === 100,
                        'bg-red-400': item.progress !== 100,
                      }"
                      :style="{
                        width: `${item.progress}%`,
                        transition: 'width 0.5s'
                      }"
                    />
                  </div>
                </div>
                <div class="mx-8 flex items-center content-center">
                  <div>
                    {{ item.progress }}
                  </div>
                  <div>%</div>
                </div>
                <div class="flex w-96 gap-4">
                  <AppButton
                    type="secondary"
                    class="px-8"
                    v-if="item.data_type === 'stop' || item.data_type === 'finish'"
                    @click="handleRemoveTask(item.task_id)"
                  >
                    {{ $t("Delete") }}
                  </AppButton>
                  <AppButton
                    v-if="item.data_type === 'stop'"
                    type="primary"
                    class="px-8"
                    :is-enable="!isProgress"
                    @click="handleStartTask(item.task_id)"
                  >
                    {{ $t("Start") }}
                  </AppButton>
                  <AppButton
                    v-if="item.data_type === 'finish' || (item.data_type === 'stop' && +item.progress > 0)"
                    type="primary"
                    class="py-2 px-8"
                    @click="handleToPageDetail(item)"
                  >
                    {{ $t("Detail") }}
                  </AppButton>
                  <AppButton
                    v-if="item.data_type === 'progress'"
                    type="danger"
                    class="px-8"
                    @click="handleCancelTask(item.task_id)"
                  >
                    {{ $t("Cancel") }}
                  </AppButton>
                </div>
              </div>
              <div class="flex pb-1 pl-4">
                <div class="w-60 text-gray-400">
                  {{ $t("TaskName") }}:
                </div>
                <div>
                  {{ item.task_name }}
                </div>
              </div>
              <div class="flex pb-1 pl-4">
                <div class="w-60 text-gray-400">
                  {{ $t("RunningTime") }}:
                </div>
                <div class="flex">
                  <template v-if="!item.running_start_time">
                    -
                  </template>
                  <template v-else>
                    <div>
                      {{ `${spiderman.formatDate.parseYMD(item.running_start_time)} ${spiderman.dayjs(item.running_start_time).format('HH:mm:ss')}` }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="flex pb-1 pl-4">
                <div class="w-60 text-gray-400">
                  {{ $t("Duration") }}:
                </div>
                <div class="flex">
                  <template v-if="!item.running_start_time && !item.running_end_time">
                    -
                  </template>
                  <template v-else>
                    &lt; {{ parseTime(item.running_end_time - item.running_start_time) }}
                  </template>
                </div>
              </div>

              <AppDivider />

              <div class="flex pt-2 pb-1 pl-4">
                <div class="w-60 text-gray-400">
                  {{ $t("TimeRange") }}:
                </div>
                <div class="flex">
                  <template v-if="!item.search_start_time && !item.search_end_time">
                    -
                  </template>
                  <template v-else>
                    <div>
                      {{ `${spiderman.formatDate.parseYMD(item.search_start_time)} ${spiderman.dayjs(item.search_start_time).format('HH:mm')}` }}
                    </div>
                    <div class="mx-5">
                      ~
                    </div>
                    <div>
                      {{ `${spiderman.formatDate.parseYMD(item.search_end_time)} ${spiderman.dayjs(item.search_end_time).format('HH:mm')}` }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="flex pb-1 pl-4">
                <div class="w-60 text-gray-400">
                  {{ $t("LiveChannel") }}:
                </div>
                <div class="flex-grow aira-row-auto-8 gap-y-2">
                  <template v-if="item.livechannels.length === 0">
                    -
                  </template>
                  <template v-else>
                    <div
                      v-for="livechannel in item.livechannels"
                      :key="livechannel.camera_id"
                    >
                      {{ livechannel.name }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="flex pl-4">
                <div class="w-60 text-gray-400">
                  {{ $t("NxVideoArchive") }}:
                </div>
                <div class="flex-grow aira-row-auto-8 gap-y-2">
                  <template v-if="item.archchannels.length === 0">
                    -
                  </template>
                  <template v-else>
                    <div
                      v-for="archchannel in item.archchannels"
                      :key="archchannel.camera_id"
                    >
                      {{ archchannel.name }}
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </div>
          <AppDivider />
        </div>
      </template>
    </FullLayout>
  </ProgressBarLayout>
</template>

<script setup>
import {
  ref, onMounted, onUnmounted, computed
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import NavigationBar from '@/modules/investigation/components/NavigationBar.vue';

import useStore from '@/modules/investigation/stores/index';
import { useI18n } from 'vue-i18n';

const store = useStore();
const { dataType, page } = storeToRefs(store);
const { setPage, setSelectedTask, getTaskListWithoutResult, startTask, removeTask, getTask, modifyTask, stopTask } = store;

const i18n = useI18n();

const isProgress = ref(false);

const list = ref([]);
async function refreshList() {
  if (page.value !== 'list') return;
  const { task_list: taskList } = await getTaskListWithoutResult();
  list.value = taskList.reverse();
}

let refreshIntervalID;
async function setRefreshInterval(taskId) {

  refreshIntervalID = setInterval(
    async () => {
      await refreshList();
      const isFinish = (list.value
        .find((item) => (item.task_id === taskId)))
        .progress === 100;

      if (isFinish) {
        isProgress.value = false;
        clearInterval(refreshIntervalID);
      }
    },
    5 * 1000,
  );
}

function parseTime(timestamp) {
  const sec = Math.floor(timestamp / 1000);
  const timeList = ['', '', '', '']; // day / hr / min / sec
  const timeMap = [i18n.t('UnitDay'), i18n.t('UnitHour'), i18n.t('UnitMin'), i18n.t('UnitSec')];
  let temp = sec;
  timeList.forEach((_, idx) => {
    const pIdx = timeList.length - idx - 1;
    const val = Math.floor(temp / Math.pow(60, pIdx));
    if (val > 0) timeList[idx] = val + ' ' + timeMap[idx];
    temp = temp % Math.pow(60, pIdx);
  });
  return timeList.filter((t) => t !== '').slice(0, 2).join('');
}

onMounted(async () => {
  await refreshList();
  const progressItem = list.value.find((item) => (item.data_type === 'progress'));

  if (progressItem) setRefreshInterval(progressItem.task_id);
});

onUnmounted(() => {
  clearInterval(refreshIntervalID);
});

async function handleStartTask(taskId) {
  isProgress.value = true;
  const idx = list.value.findIndex((item) => (item.task_id === taskId));
  list.value[idx].data_type = 'progress';
  const { message } = await startTask(taskId);
  if (message === 'ok') {
    setRefreshInterval(taskId);
  } else {
    isProgress.value = false;
    list.value[idx].data_type = 'stop';
  }
}

async function handleRemoveTask(taskId) {
  await removeTask(taskId);
  list.value = list.value.filter((item) => (item.task_id !== taskId));
}

async function handleCancelTask(taskId) {
  const data = await getTask(taskId);
  const result = [];
  for (const sub of data.task.subtasks) {
    const { message } = await stopTask(sub.task_id)
    result.push(message === 'ok');
  }
  if (result.filter((item) => item).length === data.task.subtasks.length) {
    const { message } = await modifyTask(taskId, 'stop');
    if (message === 'ok') {
      isProgress.value = false;
      const idx = list.value.findIndex((item) => (item.task_id === taskId));
      list.value[idx].data_type = 'stop';
      clearInterval(refreshIntervalID);
    }
  }
}

async function handleToPageDetail(item) {
  setPage('detail');
  setSelectedTask(item);
}
</script>
