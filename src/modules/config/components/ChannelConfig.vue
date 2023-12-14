<template>
  <div class="w-full relative" style="height: calc(100% - 4rem)">
    <div class="absolute -top-11 right-0 text-white text-xl">License: <span class="text-primary">{{ current }}</span> / {{ licenseCount }}</div>
    <AppDataTable :rowHeight="80" :columns="column" :dataList="pageData" :margin="100">
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
    </AppDataTable>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import useStore from '@/modules/config/stores/index';
import AppDataTable from '@/components/AppDataTable.vue';

const store = useStore();
const { getLiveDevices, getDevices, postLiveDevice, deleteLiveDevice, getLicense } = store;

const column = ref([
  {
    width: '10%',
    key: 'open',
    align: 'center',
    text: 'Switch'
  },
  {
    width: '45%',
    key: 'camera',
    text: 'Camera'
  },
  {
    width: '15%',
    key: 'decode',
    text: 'Decode'
  },
  {
    width: '15%',
    key: 'interval',
    text: 'Interval (ms)'
  },
  {
    width: '15%',
    key: 'sensitivity',
    text: 'Sensitivity'
  }
])

const decodeList = ref({
  'Full frame': 'full',
  'I-frame only': 'iframe'
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
  'Normal': 'normal',
  'High': 'high'
})

const pageData = ref([]);
const licenseCount = ref(0);

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
    sensitivity: item.capture_sensitivity || -1
  }
}

async function onChangeLive(id) {
  const cameraIdx = pageData.value.findIndex((item) => item.cameraId === id);
  if (cameraIdx >= 0) {
    const camera = pageData.value[cameraIdx];
    if (camera.live) {
      const { message } = await deleteLiveDevice(camera.cameraId);
      if (message === 'ok') pageData.value[cameraIdx].live = false;
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
    decode_key_only: isNew ? false : camera.decodeKeyOnly
  });
  if (message === 'ok') updateList(data);
}

function updateList(data) {
  data.forEach((live) => {
    const idx = pageData.value.findIndex((item) => item.cameraId === live.camera_id);
    if (idx >= 0) pageData.value[idx] = {
      ...pageData.value[idx],
      ...parseData(live, true)
    };
  })
}

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