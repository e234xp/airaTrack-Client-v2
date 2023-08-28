<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #grow>


      </template>
    </FullLayout>
  </ProgressBarLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import spiderman from '@/spiderman';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';

import useStore from '@/modules/target/stores/index';

// import useDevices from '@/stores/devices';
import useUserStore from '@/stores/user';

const router = useRouter();

const store = useStore();
const { confirmedFace } = storeToRefs(store);
const { setPage } = store;

// const devicesStore = useDevices();
// const { devices, livedevices } = storeToRefs(devicesStore);

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

// const liveChannelAmount = ref(0);
// const archiveAmount = ref(0);
onMounted(async () => {
  // const { license } = await spiderman.apiService({
  //   url: `${spiderman.system.apiBaseUrl}/airaTracker/license`,
  //   method: 'get',
  //   headers: { sessionId: sessionId.value },
  // });

  // // filter 掉過期的
  // const validLicenses = license.filter(({ trial_end_time: trialEndTime }) => {
  //   const now = spiderman.dayjs().valueOf();
  //   return trialEndTime ? now > trialEndTime : true;
  // });

  // // 找出兩個 channel 的 limit
  // liveChannelAmount.value = validLicenses
  //   .reduce((accumulator, current) => accumulator + current.channel_amount, 0);
  // archiveAmount.value = validLicenses.some((frs) => frs) ? 999 : 0;
});

// const form = ref({
//   target: {
//     camera_id: confirmedFace.value.camera_id,
//     timestamp: confirmedFace.value.timestamp,
//   },
//   target_face_image: confirmedFace.value.data.face_image,
//   feature: confirmedFace.value.data.feature,
//   target_score: 0.5,
//   search_motion: true,
//   subtasks: [],
//   // 多久抓一張圖
//   search_interval_ms: 1000,

//   // 以下是 UI 會控制
//   search_start_time: spiderman
//     .dayjs(confirmedFace.value.timestamp)
//     .subtract(10, 'minute')
//     .format('YYYY-MM-DD HH:mm'),
//   search_end_time: spiderman.dayjs(confirmedFace.value.timestamp).format('YYYY-MM-DD HH:mm'),
//   task_name: `task-${spiderman.dayjs().format('YYYYMMDD')}`,
//   livechannels: [],
//   archchannels: [],
// });

// async function handleAddTask(theForm) {
//   const taskForm = spiderman.lodash.cloneDeep(theForm);
//   taskForm.search_start_time = spiderman.dayjs(theForm.search_start_time).valueOf();
//   taskForm.search_end_time = spiderman.dayjs(theForm.search_end_time).valueOf();

//   await spiderman.apiService({
//     url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/addtask`,
//     method: 'post',
//     headers: { sessionId: sessionId.value },
//     data: taskForm,
//   });

//   router.push({ path: '/investigation' });
// }
</script>
