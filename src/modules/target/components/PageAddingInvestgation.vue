<template>
  <ProgressBarLayout>
    <FullLayout>
      <!-- <template #header>
        <NavigationBar />
      </template> -->

      <template #grow>
        <div class="mt-16 flex justify-center" style="height: calc(100% - 3rem)">
          <div class="w-full 2xl:w-352 h-full">
            <div class="flex justify-center gap-4 h-full">
              <img
                class="w-1/5 object-contain object-top"
                :src="spiderman.base64Image.getSrc(confirmedFace?.data.face_image)"
                alt=""
              >

              <div class="px-4 h-full w-2/3">
                <div class="flex mb-4 mr-4">
                  <AppLabel :label="$t('TaskName')" class="w-1/2">
                    <AppInput
                      dark
                      v-model:modelInput="form.task_name"
                      :placeholder="$t('TaskName')"
                      :dark="true"
                    />
                  </AppLabel>
                </div>
                <div class="flex gap-4 mb-4">
                  <AppLabel :label="$t('StartTime')" class="w-1/2">
                    <AppDatePicker
                      v-model:modelSelected="form.search_start_time"
                      :dark="true"
                      mode="date-time"
                    />
                  </AppLabel>
                  <AppLabel :label="$t('EndTime')" class="w-1/2">
                    <AppDatePicker
                      v-model:modelSelected="form.search_end_time"
                      :dark="true"
                      mode="date-time"
                    />
                  </AppLabel>
                </div>
                <div class="flex gap-2 mb-8" style="height: calc(100% - 20rem)">
                  <div class="w-1/2 pr-2">
                    <div class="text-white text-xl">
                      {{ $t('LiveChannel') }}
                      ({{ form.livechannels.length }}/{{ liveChannelAmount }})
                    </div>

                    <div
                      class="border-t-4 border-live-channel rounded bg-third py-2 px-4 overflow-y-auto"
                      style="height: calc(100% - 2rem)"
                    >
                      <AppCheckBox
                        class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
                        :placeholder="$t('All')"
                        :checked="form.livechannels.length===livedevices.length"
                        @on-change="()=>{
                          if(form.livechannels.length===livedevices.length){
                            form.livechannels = [];
                          } else {
                            form.livechannels = spiderman.lodash.cloneDeep(livedevices);
                          }
                        }"
                      >{{ $t('All') }}</AppCheckBox>
                      <AppCheckBox
                        v-for="livedevice in livedevices"
                        :key="livedevice.camera_id"
                        class="mb-2 text-xl text-white"
                        :placeholder="livedevice.name"
                        v-model:modelInput="form.livechannels"
                        :value="livedevice"
                        :disabled="(form.livechannels.length>=liveChannelAmount)
                          &&!form.livechannels
                            .map(({camera_id})=>camera_id).includes(livedevice.camera_id)"
                      >{{ livedevice.name }}</AppCheckBox>
                    </div>
                  </div>

                  <div class="w-1/2 pr-2">
                    <div class="text-white text-xl">
                      {{ $t('NxVideoArchive') }}
                      <!-- ({{ form.archchannels.length }}/{{ archiveAmount }}) -->
                    </div>
                    <div
                      class="border-t-4 border-archive-channel rounded bg-third py-2 px-4 overflow-y-auto"
                      style="height: calc(100% - 2rem)"
                    >
                      <AppCheckBox
                        class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
                        :placeholder="$t('All')"
                        :checked="form.archchannels.length===devices.length"
                        @on-change="()=>{
                          if(form.archchannels.length===devices.length){
                            form.archchannels = [];
                          } else {
                            form.archchannels = spiderman.lodash.cloneDeep(devices);
                          }
                        }"
                      >{{ $t('All') }}</AppCheckBox>
                      <AppCheckBox
                        v-for="device in devices"
                        :key="device.camera_id"
                        class="mb-2 text-xl text-white"
                        :placeholder="device.name"
                        v-model:modelInput="form.archchannels"
                        :value="device"
                        :disabled="(form.archchannels.length>=archiveAmount)
                          &&!form.archchannels
                            .map(({camera_id})=>camera_id).includes(device.camera_id)"
                      >{{ device.name }}</AppCheckBox>
                    </div>
                  </div>
                </div>
                <div class="flex justify-end gap-4">
                  <AppButton
                    type="secondary"
                    class="px-6"
                    @click="setPage('list')"
                  >
                    {{ $t('Return') }}
                  </AppButton>
                  <AppButton
                    type="primary"
                    class="px-6"
                    @click="handleAddTask(form)"
                    :is-enable="form.archchannels.length > 0
                      || form.livechannels.length > 0"
                  >
                    {{ $t('AddInvestigation') }}
                  </AppButton>
                </div>
              </div>
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

const router = useRouter();

const store = useStore();
const { confirmedFace } = storeToRefs(store);
const { setPage, getLicense, addTask } = store;

const devicesStore = useDevices();
const { devices, livedevices } = storeToRefs(devicesStore);

const liveChannelAmount = ref(0);
const archiveAmount = ref(0);
onMounted(async () => {
  const { license } = await getLicense();

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
    camera_id: confirmedFace.value.camera_id,
    timestamp: confirmedFace.value.timestamp,
  },
  target_face_image: confirmedFace.value.data.face_image,
  feature: confirmedFace.value.data.feature,
  target_score: 0.5,
  search_motion: true,
  subtasks: [],
  // 多久抓一張圖
  search_interval_ms: 1000,

  // 以下是 UI 會控制
  search_start_time: spiderman
    .dayjs(confirmedFace.value.timestamp)
    .subtract(1, 'hour')
    .format('YYYY-MM-DD HH:mm'),
  search_end_time: spiderman.dayjs(confirmedFace.value.timestamp).format('YYYY-MM-DD HH:mm'),
  task_name: `task-${spiderman.dayjs().format('YYYYMMDD')}`,
  livechannels: [],
  archchannels: [],
});

async function handleAddTask(theForm) {
  const taskForm = spiderman.lodash.cloneDeep(theForm);
  taskForm.search_start_time = spiderman.dayjs(theForm.search_start_time).valueOf();
  taskForm.search_end_time = spiderman.dayjs(theForm.search_end_time).valueOf();

  addTask(taskForm);

  router.push({ path: '/investigation' });
}
</script>
