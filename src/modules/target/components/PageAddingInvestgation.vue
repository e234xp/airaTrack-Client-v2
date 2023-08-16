<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="mt-12 flex justify-center">
          <div class="w-full 2xl:w-352">
            <div class="aira-row-auto-10 gap-4">
              <img
                class="w-full"
                :src="spiderman.base64Image.getSrc(selectedFace?.data.face_image)"
                alt=""
              >

              <div class="col-span-2 p-4">
                <div class="aira-row-auto-8 gap-4 mb-4">
                  <AppLabel :label="$t('TaskName')">
                    <AppInput
                      v-model:modelInput="form.task_name"
                      :placeholder="$t('TaskName')"
                    />
                  </AppLabel>
                </div>
                <div class="aira-row-auto-8 gap-4 mb-4">
                  <AppLabel :label="$t('StartTime')">
                    <AppDatePicker
                      v-model:modelSelected="form.search_start_time"
                      mode="date-time"
                    />
                  </AppLabel>
                  <AppLabel :label="$t('EndTime')">
                    <AppDatePicker
                      v-model:modelSelected="form.search_end_time"
                      mode="date-time"
                    />
                  </AppLabel>
                </div>
                <div class="aira-row-auto-8 gap-4 mb-4">
                  <div>
                    <div class="mb-1 text-white text-2xl">
                      Live Channel
                      ({{ form.livechannels.length }}/{{ liveChannelAmount }})
                    </div>

                    <div
                      class="border-t-4 border-primary rounded bg-gray-800 bg-opacity-50 py-2 px-4"
                    >
                      <AppCheckBox
                        class="mb-7 text-3xl text-white"
                        :placeholder="$t('All')"
                        :checked="form.livechannels.length===livedevices.length"
                        @on-change="()=>{
                          if(form.livechannels.length===livedevices.length){
                            form.livechannels = [];
                          } else {
                            form.livechannels = spiderman.lodash.cloneDeep(livedevices);
                          }
                        }"
                      />
                      <AppCheckBox
                        v-for="livedevice in livedevices"
                        :key="livedevice.camera_id"
                        class="mb-4 text-3xl text-white"
                        :placeholder="livedevice.name"
                        v-model:modelInput="form.livechannels"
                        :value="livedevice"
                        :disabled="(form.livechannels.length>=liveChannelAmount)
                          &&!form.livechannels
                            .map(({camera_id})=>camera_id).includes(livedevice.camera_id)"
                      />
                    </div>
                  </div>

                  <div>
                    <div class="mb-1 text-white text-2xl">
                      Nx Video Archive
                      ({{ form.archchannels.length }}/{{ archiveAmount }})
                    </div>
                    <div
                      class="border-t-4 border-primary rounded bg-gray-800 bg-opacity-50 py-2 px-4"
                    >
                      <AppCheckBox
                        class="mb-7 text-3xl text-white"
                        :placeholder="$t('All')"
                        :checked="form.archchannels.length===devices.length"
                        @on-change="()=>{
                          if(form.archchannels.length===devices.length){
                            form.archchannels = [];
                          } else {
                            form.archchannels = spiderman.lodash.cloneDeep(devices);
                          }
                        }"
                      />
                      <AppCheckBox
                        v-for="device in devices"
                        :key="device.camera_id"
                        class="mb-4 text-3xl text-white"
                        :placeholder="device.name"
                        v-model:modelInput="form.archchannels"
                        :value="device"
                        :disabled="(form.archchannels.length>=archiveAmount)
                          &&!form.archchannels
                            .map(({camera_id})=>camera_id).includes(device.camera_id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex justify-end">
              <AppButton
                type="secondary"
                class="mr-8 px-6 py-2 text-3xl"
                @click="setPage('list')"
              >
                {{ $t('Return') }}
              </AppButton>
              <AppButton
                type="primary"
                class="px-6 py-2 text-3xl"
                @click="handleAddTask(form)"
              >
                {{ $t('AddInvestigation') }}
              </AppButton>
            </div>
          </div>
        </div>
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

import useDevices from '@/stores/devices';
import useUserStore from '@/stores/user';

const router = useRouter();

const store = useStore();
const { selectedFace } = storeToRefs(store);
const { setPage } = store;

const devicesStore = useDevices();
const { devices, livedevices } = storeToRefs(devicesStore);

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const liveChannelAmount = ref(0);
const archiveAmount = ref(0);
onMounted(async () => {
  const { license } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/license`,
    method: 'get',
    headers: { sessionId: sessionId.value },
  });

  // filter 掉過期的
  const validLicenses = license.filter(({ trial_end_time: trialEndTime }) => {
    const now = spiderman.dayjs().valueOf();
    return trialEndTime ? now > trialEndTime : true;
  });

  // 找出兩個 channel 的 limit
  liveChannelAmount.value = validLicenses
    .reduce((accumulator, current) => accumulator + current.channel_amount, 0);
  archiveAmount.value = validLicenses.some((frs) => frs) ? 999 : 0;
});

const form = ref({
  target: {
    camera_id: selectedFace.value.camera_id,
    timestamp: selectedFace.value.timestamp,
  },
  target_face_image: selectedFace.value.data.face_image,
  feature: selectedFace.value.data.feature,
  target_score: 0.5,
  search_motion: true,
  subtasks: [],
  // 多久抓一張圖
  search_interval_ms: 1000,

  // 以下是 UI 會控制
  search_start_time: spiderman
    .dayjs(selectedFace.value.timestamp)
    .subtract(10, 'minute')
    .format('YYYY-MM-DD HH:mm'),
  search_end_time: spiderman.dayjs(selectedFace.value.timestamp).format('YYYY-MM-DD HH:mm'),
  task_name: `task-${spiderman.dayjs().format('YYYYMMDD')}`,
  livechannels: [],
  archchannels: [],
});

async function handleAddTask(theForm) {
  const taskForm = spiderman.lodash.cloneDeep(theForm);
  taskForm.search_start_time = spiderman.dayjs(theForm.search_start_time).valueOf();
  taskForm.search_end_time = spiderman.dayjs(theForm.search_end_time).valueOf();

  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/addtask`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data: taskForm,
  });

  router.push({ path: '/investigation' });
}
</script>
