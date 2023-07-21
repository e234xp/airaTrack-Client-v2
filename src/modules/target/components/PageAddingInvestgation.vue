<template>
  <ProgressBarLayout>
    <div class="w-full flex flex-col">
      <NavigationBar />
      <div
        class="flex-grow overflow-y-auto flex flex-col"
      >
        <div class="mt-12 flex justify-center">
          <div class="w-full 2xl:w-352">
            <div
              class="aira-row-auto-10 gap-4"
            >
              <img
                class="w-full h-full"
                :src="spiderman.base64Image.getSrc(selectedFace.face_image)"
                alt=""
              >

              <div
                class="col-span-2 border-4 p-4 aira-row-auto-8 content-start gap-4"
              >
                <AppLabel
                  :label="$t('StartTime')"
                >
                  <AppDatePicker
                    v-model:modelSelected="selectedTime"
                    mode="date-time"
                  />
                </AppLabel>
                <AppLabel
                  :label="$t('EndTime')"
                >
                  <AppDatePicker
                    v-model:modelSelected="selectedTime"
                    mode="date-time"
                  />
                </AppLabel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProgressBarLayout>
</template>

<script setup>
import { inject, ref } from 'vue';
import { storeToRefs } from 'pinia';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';

import useStore from '@/modules/target/stores/index';

const spiderman = inject('$spiderman');

const store = useStore();
const { selectedFace } = storeToRefs(store);

const selectedTime = ref(spiderman.dayjs().format('YYYY-MM-DD HH:mm'));
</script>
