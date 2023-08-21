<template>
  <div
    id="printPdf"
  >
    <div class="a4">
      <div class="mb-8">
        <div
          class="bg-primary rounded mb-6 px-8 py-4 text-white text-3xl"
        >
          {{ form.title }}
        </div>

        <div class="flex px-4">
          <img
            class="w-40 h-40 mr-8"
            :src="spiderman.base64Image.getSrc(task.target_face_image)"
            alt=""
          >
          <div class="flex-grow text-2xl">
            <div class="mb-3">
              {{ form.subject }}
            </div>
            <div class="mb-3">
              {{ targetDevice.name }}
            </div>
            <div class="mb-3">
              {{ spiderman.dayjs(task.search_start_time)
                .format('YYYY/MM/DD HH:mm:ss') }}
              ~
              {{ spiderman.dayjs(task.search_end_time)
                .format('YYYY/MM/DD HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div
          class="bg-primary rounded mb-6 px-6 py-2 text-white text-2xl"
        >
          Summary
        </div>

        <div class="px-4">
          <div
            v-for="(result, index) in results"
            :key="result"
            class="flex mb-4"
          >
            <div
              class="w-5 h-5 border rounded-full  mr-4"
              :class="{
                'bg-primary': index % 2 === 0,
                'border border-primary': index % 2 !== 0,
              }"
            />
            <div class="w-40 flex items-center">
              {{ spiderman.dayjs(result.highest.timestamp)
                .format('YYYY/MM/DD HH:mm:ss') }}
            </div>
            <div class="w-40 flex items-center">
              {{ findDevice(result.highest.cid).name }}
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div
          class="bg-primary rounded mb-6 px-6 py-2 text-white text-2xl"
        >
          Remark
        </div>
        <div class="px-4">
          {{ form.remark }}
        </div>
      </div>
    </div>

    <div class="a4">
      <div class="mb-8">
        <div
          class="bg-primary rounded mb-6 px-8 py-4 text-white text-3xl"
        >
          {{ form.title }}
        </div>
      </div>

      <div class="mb-8">
        <div
          class="bg-primary rounded mb-6 px-6 py-2 text-white text-2xl"
        >
          Incident Information
        </div>

        <div
          v-for="(result, index) in results"
          :key="result"
          class="mb-4 sticker"
        >
          <div class="mb-4 px-6 py-2 bg-gray-300 rounded flex">
            <div class="w-40 flex items-center">
              {{ spiderman.dayjs(result.highest.timestamp)
                .format('YYYY/MM/DD HH:mm:ss') }}
            </div>
            <div class="w-40 flex items-center">
              {{ findDevice(result.highest.cid).name }}
            </div>
          </div>

          <div class="flex">
            <img
              class="w-40 h-40 mr-8"
              :src="spiderman.base64Image.getSrc(result.highest.face_image)"
              alt=""
            >
            <img
              class="h-80 mr-8"
              :src="resultSnapShots[index]"
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

const props = defineProps({
  task: {
    type: Object,
    default() {
      return {};
    },
  },
  results: {
    type: Array,
    default() {
      return {};
    },
  },
  form: {
    type: Object,
    default() {
      return {};
    },
  },
});

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const devicesStore = useDevices();
const { findDevice } = devicesStore;

const targetDevice = computed(() => findDevice(props.task.target.camera_id));

const resultSnapShots = computed(() => props.results.map((r) => `${spiderman.system.apiBaseUrl}/airaTracker/viewsnapshot?sessionId=${sessionId.value}&camera_id=${r.highest.cid}&time=${r.highest.timestamp}`));
</script>

<style lang="scss" scoped>
@media screen {
  #printPdf{
    display: none;
  }
}
@media print {
  #printPdf{
    display: block;
  }
}
.a4 {
  // 強制一組換頁
  break-after: page;
}
.sticker {
  break-inside: avoid;
}
</style>
