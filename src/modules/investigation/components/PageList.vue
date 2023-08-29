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
          class="mx-8"
        >
          <div class="flex py-8">
            <img
              class="w-72 h-72 mr-8"
              :src="spiderman.base64Image.getSrc(item.target_face_image)"
              alt=""
            >

            <div class="flex-grow text-white text-2xl">
              <div class="flex justify-around py-2">
                <div class="w-32 mr-8 flex items-center content-center">
                  <template v-if="item.data_type === 'stop'">
                    {{ $t('Init') }}
                  </template>
                  <template v-else-if="item.data_type === 'progress'">
                    {{ $t('Processing') }}
                  </template>
                  <template v-else-if="item.data_type === 'finish'">
                    {{ $t('Completed') }}
                  </template>
                </div>
                <div class="w-full flex items-center">
                  <div class="w-full bg-gray-200 rounded-full h-3.5 dark:bg-gray-700">
                    <div
                      class="h-3.5 rounded-full"
                      :class="{
                        'bg-green-600': item.progress === 100,
                        'bg-red-300': item.progress !== 100,
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
                <div class="flex w-112">
                  <AppButton
                    type="secondary"
                    class="mr-6 py-2 px-8"
                    :is-enable="item.data_type==='stop' || item.data_type==='finish'"
                    @click="handleRemoveTask(item.task_id)"
                  >
                    {{ $t("Delete") }}
                  </AppButton>
                  <AppButton
                    v-if="item.data_type==='stop' || item.data_type==='progress'"
                    type="primary"
                    class="py-2 px-8"
                    :is-enable="canStartTask"
                    @click="handleStartTask(item.task_id)"
                  >
                    {{ $t("Start") }}
                  </AppButton>
                  <AppButton
                    v-else-if="item.data_type==='finish'"
                    type="primary"
                    class="py-2 px-8"
                    @click="handleToPageDetail(item)"
                  >
                    {{ $t("Detail") }}
                  </AppButton>
                </div>
              </div>
              <div class="flex py-2">
                <div class="w-60">
                  {{ $t("TaskName") }}:
                </div>
                <div>
                  {{ item.task_name }}
                </div>
              </div>
              <div class="flex py-2">
                <div class="w-60">
                  {{ $t("RunningTime") }}:
                </div>
                <div class="flex">
                  <template v-if="!item.running_start_time && !item.running_end_time">
                    -
                  </template>
                  <template v-else>
                    <div>
                      {{ spiderman.dayjs(item.running_start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                    <div class="mx-5">
                      ~
                    </div>
                    <div>
                      {{ spiderman.dayjs(item.running_end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="flex py-2">
                <div class="w-60">
                  {{ $t("TimeRange") }}:
                </div>
                <div class="flex">
                  <template v-if="!item.search_start_time && !item.search_end_time">
                    -
                  </template>
                  <template v-else>
                    <div>
                      {{ spiderman.dayjs(item.search_start_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                    <div class="mx-5">
                      ~
                    </div>
                    <div>
                      {{ spiderman.dayjs(item.search_end_time).format('YYYY-MM-DD HH:mm:ss') }}
                    </div>
                  </template>
                </div>
              </div>
              <div class="flex py-2">
                <div class="w-60">
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
              <div class="flex py-2">
                <div class="w-60">
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
  ref, onMounted, onUnmounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import NavigationBar from '@/modules/investigation/components/NavigationBar.vue';

import useStore from '@/modules/investigation/stores/index';
import useUserStore from '@/stores/user';
import { AppDivider } from '../../../components/app';

const store = useStore();
const { dataType } = storeToRefs(store);
const { setPage, setSelectedTask } = store;

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const list = ref([]);

onMounted(async () => {
  await refreshList();
  const progressItem = list.value
    .find((item) => (item.data_type === 'progress'));

  setRefreshInterval(progressItem.task_id);
});

async function refreshList() {
  const { task_list: taskList } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/gettasklistwithoutResult`,
    method: 'post',
    headers: { sessionId: sessionId.value },
  });
  list.value = taskList.reverse();
}

const canStartTask = ref(true);
async function handleStartTask(taskId) {
  try {
    // 其他 task 不能開始
    canStartTask.value = false;

    await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/starttask`,
      method: 'post',
      headers: { sessionId: sessionId.value },
      data: { task_id: taskId },
    });

    setRefreshInterval(taskId);
  } catch {
    canStartTask.value = true;
  }
}

let refreshIntervalID;
async function setRefreshInterval(taskId) {
  canStartTask.value = false;

  refreshIntervalID = setInterval(
    async () => {
      await refreshList();
      const isFinish = (list.value
        .find((item) => (item.task_id === taskId)))
        .progress === 100;

      if (isFinish) {
        canStartTask.value = true;
        clearInterval(refreshIntervalID);
      }
    },
    5 * 1000,
  );
}
onUnmounted(() => {
  clearInterval(refreshIntervalID);
});

async function handleRemoveTask(taskId) {
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/removetask`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data: { task_id: taskId },
  });

  list.value = list.value.filter((item) => (item.task_id !== taskId));
}

async function handleToPageDetail(item) {
  setPage('detail');
  setSelectedTask(item);
}
</script>
