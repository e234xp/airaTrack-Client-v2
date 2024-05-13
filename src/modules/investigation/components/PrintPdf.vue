<template>
  <div
    id="printPdf"
    class="border-x-2 border-modal/40"
    style="margin: 0 10%;"
  >
    <div class="a4" v-for="(list, idx) in [ ...breifContent, ...imageContent ]">
      <Header :title="form.title" :username="user.username" :timestamp="task.target.timestamp"></Header>
      <template v-for="content in list">
        <Title v-if="content.includes('<Title>')">{{ $t(`${content.split('</Title>')[0].split('<Title>')[1]}`) }}</Title>
        <div v-html="content.includes('<Title>') ? content.split('</Title>')[0] : content"></div>
      </template>
      <div class="footer">
        <span class="nowpage">{{ idx + 1 }}</span>
        <span class="totalpage">/ {{ breifContent.length + imageContent.length }}</span>
        <div class="pagetiangle"></div>
      </div>
    </div>
    <div class="a4" v-if="false">      
      <div class="mb-8">
        <!-- Title -->
        <!-- 92px -->
        <Header :title="form.title" :username="user.username" :timestamp="task.target.timestamp"></Header>
        <!----------->

        <!-- 6 x 24px + 5 x 4px + (task.livechannels + task.archchannels) * 24px + N * 4px -->
        <div class="flex px-8">
          <img
            class="w-36 h-36 mr-4"
            :src="spiderman.base64Image.getSrc(task.target_face_image)"
            alt=""
          >
          <!-- gap: 0.25rem / 4px -->
          <div class="flex flex-col gap-1 text-base">
            <!-- 24px -->
            <div class="flex gap-2">
              <span class="w-24" style="opacity: 0.8;">Subject:</span>
              <span class="font-bold">{{ form.subject }}</span>
            </div>
            <!-- 24px -->
            <div class="flex gap-2">
              <span class="w-24" style="opacity: 0.8;">Report By:</span>
              <span class="font-bold">{{ user.username }}</span>
            </div>
            <!-- 24px -->
            <div class="flex gap-2">
              <span class="w-24" style="opacity: 0.8;">Create Date:</span>
              <span class="font-bold">
                {{ `${spiderman.formatDate.parseYMD(task.target.timestamp)} ${spiderman.dayjs(task.target.timestamp).format('HH:mm')}` }}
              </span>
            </div>
            <!-- 24px -->
            <div style="opacity: 0.8;">
              Investigation Period:
            </div>
            <!-- 24px -->
            <div class="font-bold">
              {{ `${spiderman.formatDate.parseYMD(task.search_start_time)} ${spiderman.dayjs(task.search_start_time).format('HH:mm:ss')}` }}
              <span class="mx-1">-</span>
              {{ `${spiderman.formatDate.parseYMD(task.search_end_time)} ${spiderman.dayjs(task.search_end_time).format('HH:mm:ss')}` }}
            </div>
            <!-- 24px -->
            <div style="opacity: 0.8;">
              Investigation Camera:
            </div>
            <!-- 24px -->
            <div class="flex gap-2 items-center">
              <div class="bg-live-channel rounded-full w-4 h-4"></div>
              <div>Live Camera</div>
            </div>
            <!-- 24px x task.livechannels -->
            <div v-for="item in task.livechannels">
              - <span class="font-bold">{{ item.name }}</span>
            </div>
            <!-- 24px -->
            <div class="flex gap-2 items-center" v-if="task.archchannels.length > 0">
              <div class="bg-archive-channel rounded-full w-4 h-4"></div>
              <div>VMS Video Archive</div>
            </div>
            <!-- 24px x task.archchannels -->
            <div class="font-bold" v-for="item in task.archchannels">
              - <span class="font-bold">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mb-8">
        <!-- 64px -->
        <Title>{{ $t('Remarks') }}</Title>
        <!-- <div class="flex mb-6">
          <div class="relative bg-primary-hover w-3/5 pl-8 py-1 mr-7 text-white text-2xl title">
            {{ $t('Remarks') }}
          </div>
          <div class="bg-primary-hover mr-2.5" style="width: 20px; transform: skewX(-30deg);"></div>
          <div class="bg-primary-hover" style="width: 12px; transform: skewX(-30deg);"></div>
        </div> -->
        <div class="px-4">
          {{ form.remark }}
        </div>
      </div>

      <div class="mb-8">
        <!-- 64px -->
        <Title>{{ $t('Summary') }}</Title>

        <!-- 32px x N(results) -->
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
            <div class="w-60 flex items-center">
              {{ `${spiderman.formatDate.parseYMD(result.highest.timestamp)} ${spiderman.dayjs(result.highest.timestamp).format('HH:mm:ss')}` }}
            </div>
            <div class="w-40 flex items-center">
              {{ findDevice(result.highest.cid).name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="a4" v-if="false">
      <div class="mb-8">
        <!-- Title -->
        <Header :title="form.title" :username="user.username" :timestamp="task.target.timestamp"></Header>
        <!----------->
      </div>

      <div class="mb-8">
        <div class="flex mb-6">
          <div class="relative bg-primary-hover w-3/5 pl-8 py-1 mr-7 text-white text-2xl title">
            {{ $t('IncidentInformation') }}
          </div>
          <div class="bg-primary-hover mr-2.5" style="width: 20px; transform: skewX(-30deg);"></div>
          <div class="bg-primary-hover" style="width: 12px; transform: skewX(-30deg);"></div>
        </div>

        <!-- 32px -->
        <div
          v-for="(result, index) in results"
          :key="result"
          class="mb-8 sticker mx-8"
        >
          <!-- 24px + 16px -->
          <div class="mb-4 px-2 py-2 bg-gray-200 flex font-bold">
            <div class="w-60 flex items-center">
              {{ `${spiderman.formatDate.parseYMD(result.highest.timestamp)} ${spiderman.dayjs(result.highest.timestamp).format('HH:mm:ss')}` }}
            </div>
            <div class="w-40 flex items-center">
              {{ findDevice(result.highest.cid).name }}
            </div>
          </div>

          <div class="flex gap-4">
            <img
              class="w-36 h-36"
              :src="spiderman.base64Image.getSrc(result.highest.face_image)"
              alt=""
            >
            <img
              style="width: calc(100% - 10rem)"
              :src="resultSnapShots[index]"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- <div class="page-footer">Page </div> -->
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';
import useDevices from '@/stores/devices';

import Header from './pdf/Header.vue';
import PageLayout from './pdf/PageLayout.vue';
import Title from './pdf/Title.vue';

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
      return [];
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

const i18n = useI18n();

const targetHeight = ref(0);
const baseSize = ref(0);

const header = ref(8.75); // 92px + 48px
const profile = ref(10.25); // 164px
const profileChannel = ref(1.75) // 28px
const title = ref(4); // 64px
const remark = ref(1.5); // 24px
const summaryRecord = ref(2) // 32px

const resultSnapShots = computed(() => props.results.map((r) => `${spiderman.system.apiBaseUrl}/airaTracker/viewsnapshot?sessionId=${sessionId.value}&camera_id=${r.highest.cid}&time=${r.highest.timestamp}`));

const gapH = computed(() => 1.5 * baseSize.value);
const profileH = computed(() => profile.value * baseSize.value);

const remarkH = computed(() => {
  const content = props.form.remark;
  const remarkLines = Math.ceil(content.length / 50);
  const remarkHeight = remarkLines * remark.value;
  return (remarkHeight + title.value) * baseSize.value;
});

const breifContent = computed(() => {
  if (props.results.length === 0) return [];
  const region = targetHeight.value - (baseSize.value * header.value);
  const profile = `
    <div class="flex px-8 mb-1">
      <img
        class="w-36 h-36 mr-4"
        src="${spiderman.base64Image.getSrc(props.task.target_face_image)}"
        alt=""
      >
      <div class="flex flex-col gap-1 text-base">
        <div class="flex gap-2">
          <span class="w-24" style="opacity: 0.8;">${i18n.t('Subject')}:</span>
          <span class="font-bold">${props.form.subject}</span>
        </div>
        <div class="flex gap-2">
          <span class="w-24" style="opacity: 0.8;">${i18n.t('ReportBy')}:</span>
          <span class="font-bold">${user.username}</span>
        </div>
        <div class="flex gap-2">
          <span class="w-24" style="opacity: 0.8;">${i18n.t('CreateDate')}:</span>
          <span class="font-bold">
            ${`${spiderman.formatDate.parseYMD(props.task.target.timestamp)} ${spiderman.dayjs(props.task.target.timestamp).format('HH:mm')}`}
          </span>
        </div>
        <div style="opacity: 0.8;">
          ${i18n.t('InvestigationPeriod')}:
        </div>
        <div class="font-bold">
          ${`${spiderman.formatDate.parseYMD(props.task.search_start_time)} ${spiderman.dayjs(props.task.search_start_time).format('HH:mm:ss')}`}
          <span class="mx-1">-</span>
          ${`${spiderman.formatDate.parseYMD(props.task.search_end_time)} ${spiderman.dayjs(props.task.search_end_time).format('HH:mm:ss')}`}
        </div>
        <div style="opacity: 0.8;">
          ${i18n.t('InvestigationCamera')}:
        </div>
      </div>
    </div>`;
  const livechannels = props.task.livechannels.length > 0 ? [
    `<div class="flex gap-2 items-center ml-48"><div class="bg-live-channel rounded-full w-4 h-4"></div><div>${i18n.t('LiveChannel')}</div></div>`,
    ...props.task.livechannels.map((item) => `<div class="font-bold ml-48">- <span class="font-bold">${item.name}</span></div>`)
  ] : [];
  const archchannels = props.task.archchannels.length > 0 ? [
    `<div class="flex gap-2 items-center ml-48"><div class="bg-archive-channel rounded-full w-4 h-4"></div><div>${i18n.t('NxVideoArchive')}</div></div>`,
    ...props.task.archchannels.map((item) => `<div class="font-bold ml-48">- <span class="font-bold">${item.name}</span></div>`)
  ] : [];
  const remark = `<Title>Remarks</Title><div class="px-4">${props.form.remark}</div>`;
  const summary = props.results.map((item, index) => `
  <div class="w-full flex mb-2 items-center px-8">
    <div class="w-5 h-5 border rounded-full mr-4 ${index % 2 === 0 ? 'bg-primary-hover' : ''} ${index % 2 !== 0 ? 'border border-primary-hover' : ''}"></div>
    <div class="w-60 flex items-center">
      ${spiderman.formatDate.parseYMD(item.highest.timestamp)} ${spiderman.dayjs(item.highest.timestamp).format('HH:mm:ss')}
    </div>
    <div class="w-40 flex items-center">
      ${findDevice(item.highest.cid).name}
    </div>
  </div>`);
  const sizeMap = [
    profileH.value,
    ...livechannels.map(() => profileChannel.value * baseSize.value),
    ...archchannels.map(() => profileChannel.value * baseSize.value),
    getGapH(3),
    remarkH.value,
    getGapH(),
    title.value * baseSize.value,
    ...summary.map(() => summaryRecord.value * baseSize.value),
  ];
  const contentMap = [
    profile,
    ...livechannels,
    ...archchannels,
    getGapDom(3),
    remark,
    getGapDom(),
    `<Title>Summary</Title>`,
    ...summary,
  ];
  const allContentH = sizeMap.reduce((acc, cur) => acc + cur, 0);
  const breifPage = Math.ceil(allContentH / region);
  const result = []; 
  let cIdx = 0;
  for (let i = 0; i < breifPage; i++) {
    const temp = [];
    let pageH = +region;
    while(cIdx < contentMap.length && pageH > sizeMap[cIdx]) {
      temp.push(contentMap[cIdx]);
      pageH -= sizeMap[cIdx];
      cIdx++;
    }
    result.push(temp);
  };
  return result;
});

const imageContent = computed(() => {
  if (props.results.length === 0) return [];
  const region = targetHeight.value - (baseSize.value * header.value);

  const resultList = props.results.map((item, index) => `
    <div class="mb-8 sticker mx-8">
      <div class="mb-4 px-2 py-2 bg-gray-200 flex font-bold">
        <div class="w-60 flex items-center">
          ${`${spiderman.formatDate.parseYMD(item.highest.timestamp)} ${spiderman.dayjs(item.highest.timestamp).format('HH:mm:ss')}`}
        </div>
        <div class="w-40 flex items-center">
          ${findDevice(item.highest.cid).name}
        </div>
      </div>
      <div class="flex gap-4">
        <img class="w-36 h-36"
          src="${spiderman.base64Image.getSrc(item.highest.face_image)}">
        <img style="width: calc(100% - 10rem); height: 14rem; object-fit:contain" src="${resultSnapShots.value[index]}" alt="${i18n.t('ExpiredData')}">
      </div>
    </div>
  `);
  const sizeMap = [
    title.value * baseSize.value,
    ...resultList.map(() => (19.5) * baseSize.value)
  ];
  const contentMap = [
    `<Title>IncidentInformation</Title>`,
    ...resultList,
  ];
  const allContentH = sizeMap.reduce((acc, cur) => acc + cur, 0);
  const breifPage = Math.ceil(allContentH / region);
  const result = []; 
  let cIdx = 0;
  for (let i = 0; i < breifPage; i++) {
    const temp = [];
    let pageH = +region;
    while(cIdx < contentMap.length && pageH > sizeMap[cIdx]) {
      temp.push(contentMap[cIdx]);
      pageH -= sizeMap[cIdx];
      cIdx++;
    }
    result.push(temp);
  };
  return result;
});

function getGapDom(times = 1) {
  return `<div class="w-full" style="height: ${gapH.value * times}px;"></div>`;
}

function getGapH(times = 1) {
  return gapH.value * times;
}

onBeforeMount(() => {
  const a4HeightMm = 297;
  const ppi = window.devicePixelRatio * 96;
  // targetHeight.value = a4HeightMm * (ppi / 25.4);
  targetHeight.value = 1123;
  // console.log('targetHeight', targetHeight.value);

  const rootElement = document.documentElement;
  const rootStyles = window.getComputedStyle(rootElement);
  const baseFontSize = rootStyles.fontSize;
  baseSize.value = parseFloat(baseFontSize);
})
</script>

<style lang="scss" scoped>
@media screen {
  #printPdf {
    display: none;
  }
}
@media print {
  body {
    counter-reset: page;
  }

  #printPdf {
    display: block;
  }

  @page {
    size: A4;
    margin: 0;
  }

  .a4 {
    position: relative;
    height: 100vh;
  }
}

.footer {
  position: absolute;
  bottom: 6px;
  right: 10px;
}
.footer .pagetiangle {
  position: absolute;
  border-color: transparent rgba(108, 187, 255, 0.2) rgba(108, 187, 255, 0.2) transparent;
  border-style: solid solid solid solid;
  border-width: 32px 32px;
  height: 0px;
  width: 0px;
  bottom: -6px;
  right: -10px;
  z-index: 1;
}
.footer .nowpage {
  position: relative;
  font-size: 2rem;
  letter-spacing: 0px;
  font-family: Helvetica;
  color: #696969;
  z-index: 2;
}
.footer .totalpage { 
  position: relative; 
  font-size: 1rem; 
  letter-spacing: 0px; 
  font-family: Helvetica; 
  color: #696969; 
  z-index: 2; 
}

.sticker {
  break-inside: avoid;
}
</style>
