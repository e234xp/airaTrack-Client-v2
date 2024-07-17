<template>
  <div class="w-full relative" style="height: calc(100% - 4rem)">
    <div class="absolute -top-11 right-0 text-white text-xl">{{ $t('License') }}: <span class="text-primary">{{ current }}</span> / {{ licenseCount }}</div>
    <div class="flex items-center justify-between my-2 w-full">
      <div class="flex items-center gap-2 w-1/3">
        <AppButton type="primary" :isEnable="isValid" class="w-1/4 px-6" @click="onSync">
          {{ $t('Sync') }}
        </AppButton>
        <AppInput v-model:modelInput="searchText" class="w-full" :rule="''" :dark="true" />
        <AppSvgIcon name="icon-search" class="text-white w-6 h-6 mr-2" />
      </div>
      <div class="flex items-center gap-4 w-1/3">
        <AppSwitch :value="searchOnlyLive" :list="searchList" @select="onSwitch" class="!w-1/2"></AppSwitch>
        <AppInput :dark="true" type="select" class="w-full !w-1/2" :options="sortList" v-model:modelInput="searchSort" />
      </div>
    </div>
    <AppDataTable :rowHeight="rowHeight" :columns="column" :dataList="filterData" :margin="marginHeight" style="height: calc(100% - 3.5rem);" v-if="pageData.length !== 0">
      <template #open="props">
        <div class="flex justify-center">
          <AppToggle :value="props.data.live" @change="onChangeLive(props.data.cameraId)" :disabled="isFull && !props.data.live"></AppToggle>
        </div>
      </template>
      <template #camera="props">
        <div class="text-base">{{ props.data.name }}</div>
        <div class="text-gray-400">{{ props.data.cameraId }}</div>
      </template>
      <template #decode="props">
        <AppInput :dark="true" type="select" class="w-full" :options="decodeList"
          :modelInput="parseDecode(props.data.decodeKeyOnly)"
          @update:modelInput="onUpdateDecode($event, props.data.cameraId)" v-show="props.data.live" />
      </template>
      <template #interval="props">
        <AppInput :dark="true" type="select" class="w-full" :options="intervalList"
          :modelInput="parseInterval(props.data.interval)"
          @update:modelInput="onUpdateInterval($event, props.data.cameraId)" v-show="props.data.live" />
      </template>
      <template #sensitivity="props">
        <AppInput :dark="true" type="select" class="w-full" :options="sensitivityList"
          :modelInput="parseSensitivity(props.data.sensitivity)"
          @update:modelInput="onUpdateSensitivity($event, props.data.cameraId)" v-show="props.data.live" />
      </template>
      <template #threshold="props">
        <AppInput :dark="true" type="select" class="w-full" :options="thresholdList"
          :modelInput="props.data.threshold"
          @update:modelInput="onUpdateThreshold($event, props.data.cameraId)" v-show="props.data.live" />
      </template>
      <template #minFaceSize="props">
        <AppInput :dark="true" type="select" class="w-full" :options="sizeList"
          :modelInput="props.data.minFaceSize"
          @update:modelInput="onUpdateMinFaceSize($event, props.data.cameraId)" v-show="props.data.live" />
      </template>
    </AppDataTable>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, computed, onBeforeUnmount } from 'vue';
import { useI18n } from 'vue-i18n';

import useStore from '@/modules/config/stores/index';
import AppDataTable from '@/components/AppDataTable.vue';
import useDevices from '@/stores/devices';

const store = useStore();
const { getLiveDevices, getDevices, postLiveDevice, deleteLiveDevice, getLicense, syncDevices, getNxConfig } = store;

const devicesStore = useDevices();
const { setDevices, setLiveDevices } = devicesStore;

const i18n = useI18n();

const column = ref([
  {
    width: '8%',
    key: 'open',
    align: 'center',
    text: i18n.t('Switch')
  },
  {
    width: '25%',
    key: 'camera',
    text: i18n.t('Camera')
  },
  {
    width: '12%',
    key: 'decode',
    text: i18n.t('Decode')
  },
  {
    width: '12%',
    key: 'interval',
    text: i18n.t('IntervalMs')
  },
  {
    width: '12%',
    key: 'sensitivity',
    text: i18n.t('Sensitivity')
  },
  {
    width: '12%',
    key: 'threshold',
    text: i18n.t('CaptureThreshold')
  },
  {
    width: '12%',
    key: 'minFaceSize',
    text: i18n.t('MinFaceSize')
  }
])

const decodeList = ref({
  [`${i18n.t('FullFrame')}`]: 'full',
  [`${i18n.t('IFrameOnly')}`]: 'iframe'
})

const intervalList = ref({
  '5000': '5000',
  '3000': '3000',
  '2000': '2000',
  '1000': '1000',
  '500': '500',
  '200': '200',
  '100': '100'
})

const sensitivityList = ref({
  [`${i18n.t('Normal')}`]: 'normal',
  [`${i18n.t('High')}`]: 'high'
})

const thresholdList = ref({
  [`${i18n.t('Small')}`]: 0.1,
  [`${i18n.t('Medium')}`]: 0.5,
  [`${i18n.t('High')}`]: 0.8
})

const sizeList = ref({
  [`${i18n.t('Unlimited')}`]: 0,
  [`${i18n.t('Small')}`]: 50,
  [`${i18n.t('Medium')}`]: 100,
  [`${i18n.t('Large')}`]: 150
})

const searchList = ref([
  { text: i18n.t('All'), value: false },
  { text: i18n.t('Using'), value: true }
])

const sortList = ref({
  [`${i18n.t('Camera')}`]: 'asc',
  [`${i18n.t('Camera')} `]: 'desc'
})

const pageData = ref([]);
const licenseCount = ref(0);
const rowHeight = ref(0);
const marginHeight = ref(0);
const searchText = ref('');
const searchOnlyLive = ref(false);
const searchSort = ref('asc');

const filterData = computed(() => {
  return pageData.value
    .filter((item) => item.name.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0
      || item.cameraId.toLowerCase().indexOf(searchText.value.toLowerCase()) >= 0)
    .filter((item) => !searchOnlyLive.value || item.live)
    .sort((a, b) => {
      if (searchSort.value === 'asc') return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    })
})

const current = computed(() => {
  return pageData.value.reduce((acc, cur) => {
    if (cur.live) acc++;
    return acc;
  }, 0)
})

const isFull = computed(() => {
  return current.value >= licenseCount.value;
})

function parseDecode(val) {
  return val ? 'iframe' : 'full';
}

function convertDecode(val) {
  return val === 'iframe' ? true : false;
}

function parseInterval(val) {
  return (val).toString();
}

function convertInterval(val) {
  return +val;
}

function parseSensitivity(val) {
  return val >= 0.5 ? 'high' : 'normal';
}

function convertSensitivity(val) {
  return val === 'high' ? 0.5 : 0.25;
}

function parseData(item, live = false) {
  return {
    ...item,
    live,
    cameraId: item.camera_id,
    interval: item.capture_interval_ms || -1,
    decodeKeyOnly: item.decode_key_only || false,
    sensitivity: item.capture_sensitivity || -1,
    threshold: item.capture_threshold || -1,
    minFaceSize: item.min_face_size === undefined ? 50 : item.min_face_size
  }
}

function onSwitch(val) {
  searchOnlyLive.value = val;
}

async function onChangeLive(id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    const camera = pageData.value[cameraIdx];
    if (camera.live) {
      const { message } = await deleteLiveDevice(camera.cameraId);
      if (message === 'ok') {
        pageData.value[cameraIdx].live = false;
        updateStore();
      }
    } else {
      await updateLiveCamera(camera, true);
    }
  }
}

async function onUpdateDecode(val, id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    pageData.value[cameraIdx].decodeKeyOnly = convertDecode(val);
    await updateLiveCamera(pageData.value[cameraIdx]);
  }
}

async function onUpdateInterval(val, id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    pageData.value[cameraIdx].interval = convertInterval(val);
    await updateLiveCamera(pageData.value[cameraIdx]);
  }
}

async function onUpdateSensitivity(val, id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    pageData.value[cameraIdx].sensitivity = convertSensitivity(val);
    await updateLiveCamera(pageData.value[cameraIdx]);
  }
}

async function onUpdateThreshold(val, id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    pageData.value[cameraIdx].threshold = val;
    await updateLiveCamera(pageData.value[cameraIdx]);
  }
}

async function onUpdateMinFaceSize(val, id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    pageData.value[cameraIdx].minFaceSize = val;
    await updateLiveCamera(pageData.value[cameraIdx]);
  }
}

async function updateLiveCamera(camera, isNew = false) {
  const { message, data } = await postLiveDevice({
    server_ip: camera.server.ip,
    server_port: camera.server.port,
    username: camera.server.user,
    password: camera.server.pass,
    camera_id: camera.camera_id,
    name: camera.name,
    capture_interval_ms: isNew ? 1000 : camera.interval,
    capture_sensitivity: isNew ? 0.25 : camera.sensitivity,
    capture_threshold: isNew ? 0.5 : camera.threshold,
    decode_key_only: isNew ? false : camera.decodeKeyOnly,
    min_face_size: isNew ? 50 : camera.minFaceSize
  });
  if (message === 'ok') updateList(data);
}

async function updateList(data) {
  data.forEach((live) => {
    const idx = pageData.value.findIndex((item) => item.cameraId === live.camera_id);
    if (idx >= 0) pageData.value[idx] = {
      ...pageData.value[idx],
      live: true,
      interval: live.capture_interval_ms || -1,
      decodeKeyOnly: live.decode_key_only || false,
      sensitivity: live.capture_sensitivity || -1,
      threshold: live.capture_threshold || -1,
      minFaceSize: live.min_face_size === undefined ? 50 : live.min_face_size
    };
  })
  updateStore();
}

async function updateStore() {
  const { data: live } = await getLiveDevices();
  setLiveDevices(live);
}

async function onSync() {
  const { message } = await syncDevices();
  if (message === 'ok') {
    // update devices
    const { data } = await getDevices();
    pageData.value = data.map((item) => parseData(item));
    const { host, password, username, authorization } = await getNxConfig();
    setDevices(data, { host, password, username, authorization });
    // update live
    const result = await getLiveDevices();
    updateList(result.data);
  }
}

onBeforeMount(() => {
  const rootElement = document.documentElement;
  const rootStyles = window.getComputedStyle(rootElement);
  const baseFontSize = rootStyles.fontSize;
  const baseFontSizeValue = parseFloat(baseFontSize);
  rowHeight.value = baseFontSizeValue * 4.65;
  marginHeight.value = baseFontSizeValue * 6.25;
}),

onMounted(async () => {
  const { data } = await getDevices();
  pageData.value = data.map((item) => parseData(item));
  const result = await getLiveDevices();
  updateList(result.data);

  const { license } = await getLicense();
  licenseCount.value = license.reduce((acc, cur) => {
    if (!cur.license_is_expired) acc += cur.channel_amount;
    return acc;
  }, 0)
})

</script>