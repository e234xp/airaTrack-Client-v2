<template>
  <ProgressBarLayout>
    <div class="w-full flex flex-col">
      <div
        class="border-b-2 border-gray-500
          grid grid-flow-col justify-center"
      >
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl
          border-b-4 border-primary"
        >
          !{{ $t('Faces') }}
        </div>
        <div
          class="aira-button px-8 py-4 text-white font-bold text-2xl"
        >
          !{{ $t('Album') }}
        </div>
      </div>

      <div
        class="border-b-2 border-gray-500 py-3 px-6
          grid grid-flow-col justify-between"
      >
        <AppDatePicker
          v-model:modelSelectedDate="selectedDate"
        />
      </div>

      <DayChart />

      <div
        class="flex-grow overflow-y-auto flex flex-col"
      >
        <div
          v-for="j in 6"
          :key="j"
          class="flex justify-center mb-20 px-5"
        >
          <div class="font-bold text-white text-2xl mr-5">
            10:00
          </div>
          <div class="w-full 2xl:w-9/12 aira-row-auto-2 gap-8">
            <div
              v-for="i in 24"
              :key="i"
              class="relative cursor-pointer"
            >
              <img
                class="border-4"
                :class="{
                  'border-primary': i === 1,
                  'border-white': i !== 1,
                }"
                :src="spiderman.base64Image.getSrc(base64)"
                alt=""
              >
              <div class="absolute top-0 left-0 w-full h-full flex justify-end items-end">
                <div
                  class="w-8 h-8 rounded flex justify-center items-center
                        text-lg font-bold"
                  :class="{
                    'bg-primary text-white': i === 1,
                    'bg-white text-gray-800': i !== 1,
                  }"
                >
                  4
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <TargetSideBar />
  </ProgressBarLayout>
</template>

<script setup>
import DayChart from '@/components/DayChart.vue';
import TargetSideBar from '@/components/TargetSideBar.vue';
import AppDatePicker from '@/components/AppDatePicker.vue';
import { inject, ref } from 'vue';

const spiderman = inject('$spiderman');

const selectedDate = ref(spiderman.dayjs().format('YYYY-MM-DD'));

const base64 = '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';

</script>
