<template>
  <div
    id="printPdf"
    class="mx-12"
  >
    <div class="a4">
      <div class="mt-4 mb-8">
        <!-- Title -->
        <div class="px-8 text-xl mb-1 text-primary-hover font-bold">airaTrack Investigation Report</div>
        <div class="bg-primary-hover rounded mb-4 px-8 py-2 flex justify-between items-center">
          <div class="text-white text-2xl">
            {{ form.title }}
          </div>
          <div class="text-white text-md text-right">
            <div>{{ user.username }}</div>
            <div>{{ spiderman.dayjs(task.target.timestamp).format('YYYY/MM/DD HH:mm') }}</div>
          </div>
        </div>
        <!----------->

        <div class="flex px-8">
          <img
            class="w-36 h-36 mr-4"
            :src="spiderman.base64Image.getSrc(task.target_face_image)"
            alt=""
          >
          <div class="flex flex-col gap-1 text-md">
            <div class="flex gap-2">
              <span class="w-24" style="opacity: 0.8;">Subject:</span>
              <span class="font-bold">{{ form.subject }}</span>
            </div>
            <div class="flex gap-2">
              <span class="w-24" style="opacity: 0.8;">Report By:</span>
              <span class="font-bold">{{ user.username }}</span>
            </div>
            <div class="flex gap-2">
              <span class="w-24" style="opacity: 0.8;">Create Date:</span>
              <span class="font-bold">
                {{ spiderman.dayjs(task.target.timestamp).format('YYYY/MM/DD HH:mm') }}
              </span>
            </div>
            <div style="opacity: 0.8;">
              Investigation Period:
            </div>
            <div class="font-bold">
              {{ spiderman.dayjs(task.search_start_time).format('YYYY/MM/DD HH:mm:ss') }}
              <span class="mx-1">-</span>
              {{ spiderman.dayjs(task.search_end_time).format('YYYY/MM/DD HH:mm:ss') }}
            </div>
            <div style="opacity: 0.8;">
              Investigation Camera:
            </div>
            <div class="flex gap-2 items-center">
              <div class="bg-live-channel rounded-full w-4 h-4"></div>
              <div>Live Camera</div>
            </div>
            <div v-for="item in task.livechannels">
              - <span class="font-bold">{{ item.name }}</span>
            </div>
            <div class="flex gap-2 items-center" v-if="task.archchannels.length > 0">
              <div class="bg-archive-channel rounded-full w-4 h-4"></div>
              <div>VMS Video Archive</div>
            </div>
            <div class="font-bold" v-for="item in task.archchannels">
              - <span class="font-bold">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <div class="flex mb-6">
          <div class="relative bg-primary-hover w-3/5 rounded pl-8 py-1 mr-7 text-white text-2xl title">
            {{ $t('Remarks') }}
          </div>
          <div class="bg-primary-hover mr-2.5" style="width: 20px; transform: skewX(-30deg);"></div>
          <div class="bg-primary-hover" style="width: 12px; transform: skewX(-30deg);"></div>
        </div>
        <div class="px-4">
          {{ form.remark }}
        </div>
      </div>

      <div class="mb-8">
        <div class="flex mb-6">
          <div class="relative bg-primary-hover w-3/5 rounded pl-8 py-1 mr-7 text-white text-2xl title">
            {{ $t('Summary') }}
          </div>
          <div class="bg-primary-hover mr-2.5" style="width: 20px; transform: skewX(-30deg);"></div>
          <div class="bg-primary-hover" style="width: 12px; transform: skewX(-30deg);"></div>
        </div>

        <div class="px-4">
          <div
            v-for="(result, index) in results"
            :key="result"
            class="flex mb-2 items-center"
          >
            <div
              class="w-5 h-5 border rounded-full  mr-4"
              :class="{
                'bg-primary-hover': index % 2 === 0,
                'border border-primary-hover': index % 2 !== 0,
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
    </div>

    <div class="a4">
      <div class="mt-4 mb-8">
        <!-- Title -->
        <div class="px-8 text-xl mb-1 text-primary-hover font-bold">airaTrack Investigation Report</div>
        <div class="bg-primary-hover rounded mb-4 px-8 py-2 flex justify-between items-center">
          <div class="text-white text-2xl">
            {{ form.title }}
          </div>
          <div class="text-white text-md text-right">
            <div>{{ user.username }}</div>
            <div>{{ spiderman.dayjs(task.target.timestamp).format('YYYY/MM/DD HH:mm') }}</div>
          </div>
        </div>
        <!----------->
      </div>

      <div class="mb-8">
        <div class="flex mb-6">
          <div class="relative bg-primary-hover w-3/5 rounded pl-8 py-1 mr-7 text-white text-2xl title">
            {{ $t('IncidentInformation') }}
          </div>
          <div class="bg-primary-hover mr-2.5" style="width: 20px; transform: skewX(-30deg);"></div>
          <div class="bg-primary-hover" style="width: 12px; transform: skewX(-30deg);"></div>
        </div>

        <div
          v-for="(result, index) in results"
          :key="result"
          class="mb-4 sticker"
        >
          <div class="mb-4 px-8 py-2 bg-gray-200 rounded flex">
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
import { ref, computed, defineExpose } from 'vue';
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
  }
});

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);
const { user } = userStore;

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

.title {
  border-top-right-radius: 0 !important;
}

.title::after {
  position: absolute;
  z-index: 1;
  content: '';
  top: 0;
  bottom: 0;
  right: -18px;
  width: 36px;
  background: #2c77a0;
  transform: skew(-30deg);
}
</style>
