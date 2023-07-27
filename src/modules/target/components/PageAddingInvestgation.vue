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
                class="w-full h-full"
                :src="spiderman.base64Image.getSrc(selectedFace?.data.face_image)"
                alt=""
              >

              <div class="col-span-2 border-4 p-4">
                <div class="aira-row-auto-8 gap-4 mb-4">
                  <AppLabel :label="$t('StartTime')">
                    <AppDatePicker
                      v-model:modelSelected="form.startTime"
                      mode="date-time"
                    />
                  </AppLabel>
                  <AppLabel :label="$t('EndTime')">
                    <AppDatePicker
                      v-model:modelSelected="form.endTime"
                      mode="date-time"
                    />
                  </AppLabel>
                  <AppLabel :label="$t('TaskName')">
                    <AppInput
                      v-model:modelInput="form.taskName"
                      :placeholder="$t('TaskName')"
                    />
                  </AppLabel>
                </div>
                <div>
                  <AppInput
                    v-for="i in 2"
                    :key="i"
                    class="mb-3"
                    type="checkbox"
                    placeholder="asdasd"
                  />
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
import { inject, ref } from 'vue';
import { storeToRefs } from 'pinia';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';

import useStore from '@/modules/target/stores/index';

import useDevices from '@/stores/devices';

const spiderman = inject('$spiderman');

const store = useStore();
const { selectedFace } = storeToRefs(store);

const devicesStore = useDevices();
const { devices } = storeToRefs(devicesStore);

const form = ref({
  startTime: spiderman
    .dayjs(selectedFace.value.timestamp)
    .subtract(10, 'minute')
    .format('YYYY-MM-DD HH:mm'),
  endTime: spiderman.dayjs(selectedFace.value.timestamp).format('YYYY-MM-DD HH:mm'),
  taskName: `task-${spiderman.dayjs().format('YYYYMMDD')}`,
});
</script>
