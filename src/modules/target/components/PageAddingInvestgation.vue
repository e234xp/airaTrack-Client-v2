<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #grow>
        <section id="🌀TargetPage">
          <div id="🔥TargetPerson">
            <img :src="spiderman.base64Image.getSrc(confirmedFace?.data.face_image)" id="🔥TargetPerson__Img">
            <div id="🔥TargetPerson__TaskName">
              <AppLabel :label="$t('TaskName')">
                <AppInput dark v-model:modelInput="form.task_name" :placeholder="$t('TaskName')" :dark="true" />
              </AppLabel>
            </div>
            <div id="🔥TargetPerson__X">
              <div id="🔥TargetPerson__X__StartTime">
                <AppLabel :label="$t('StartTime')">
                  <AppDatePicker v-model:modelSelected="form.search_start_time" :dark="true" mode="date-time" />
                </AppLabel>
              </div>
              <div id="🔥TargetPerson__X__EndTime">
                <AppLabel :label="$t('EndTime')">
                  <AppDatePicker v-model:modelSelected="form.search_end_time" :dark="true"
                    :limit="form.search_start_time" mode="date-time" />
                </AppLabel>
              </div>
            </div>
            <div id="🔥TargetPerson__Search">
              <AppLabel :label="$t('Search')">
                <input type="search" placeholder="Please enter the camera name" v-model="searchQuery"
                  class="h-[37px] w-full rounded-sm bg-[#3b3b3b] border border-gray-500 text-white focus:outline-none p-4">
              </AppLabel>
            </div>
          </div>

          <img id="🔥LineX" src="@/assets/images/line-x.png">

          <div id="🔥CameraList">
            <div id="🔥CameraList__X">
              <div class="w-1/2">
                <div class="text-white text-xl">
                  {{ $t('LiveChannel') }}
                  ({{ form.livechannels.length }}/{{ livedevices.length }})
                </div>
                <div class="border-t-4 border-live-channel rounded bg-third py-2 px-4 overflow-y-auto"
                  style="height: calc(100% - 4rem)">

                  <AppCheckBox class="pb-2 mb-2 text-base text-white border-b-2 border-dashed border-panel"
                    :placeholder="$t('All')" :checked="form.livechannels.length === livedevices.length" @on-change="() => {
                      if (form.livechannels.length === livedevices.length) {
                        form.livechannels = [];
                        toCheckedAll(false, 'live')
                      } else {
                        form.livechannels = spiderman.lodash.cloneDeep(livedevices);
                        toCheckedAll(true, 'live')
                      }
                    }">{{ $t('All') }}</AppCheckBox>

                  <AppCheckBox v-for="livedevice in filterLiveDevices" :key="livedevice.camera_id"
                    class="mb-2 text-base text-white"
                    :class="{ 'bg-camera-live': currentMapDataCamerasBg?.includes(livedevice.name) }"
                    :placeholder="livedevice.name" @click.prevent="toggleClickLive(livedevice)"
                    v-model:modelInput="form.livechannels" :value="livedevice">{{ livedevice.name }}
                  </AppCheckBox>

                </div>
              </div>

              <div class="w-1/2">
                <div class="text-white text-xl">
                  {{ $t('NxVideoArchive') }}
                  ({{ form.archchannels.length }}/{{ devices.length }})
                </div>
                <div class="border-t-4 border-archive-channel rounded bg-third py-2 px-4 overflow-y-auto"
                  style="height: calc(100% - 4rem)">
                  <AppCheckBox class="pb-2 mb-2 text-base text-white border-b-2 border-dashed border-panel"
                    :placeholder="$t('All')" :checked="form.archchannels.length === devices.length"
                    :disabled="archiveAmount === 0" @on-change="() => {
                      if (form.archchannels.length === devices.length) {
                        form.archchannels = [];
                        toCheckedAll(false, 'archive')
                      } else {
                        form.archchannels = spiderman.lodash.cloneDeep(devices);
                        toCheckedAll(true, 'archive')
                      }
                    }">{{ $t('All') }}</AppCheckBox>

                  <AppCheckBox v-for="device in filterArchiveDevices" :key="device.camera_id"
                    @click.prevent="toggleClickArch(device)" class="mb-2 text-base text-white"
                    :class="{ 'bg-camera-archive': currentMapDataCamerasBg?.includes(device.name) }"
                    :placeholder="device.name" v-model:modelInput="form.archchannels" :value="device">{{ device.name }}
                  </AppCheckBox>
                </div>
              </div>
            </div>
            <div id="🔥CameraList__X2">
              <AppButton type="secondary" class="py-2 px-8 mr-8" @click="setPage('list')">
                {{ $t('Return') }}
              </AppButton>
              <AppButton type="primary" class="py-2 px-8" @click="handleAddTask(form)" :is-enable="form.archchannels.length > 0
                || form.livechannels.length > 0">
                {{ $t('AddInvestigation') }}
              </AppButton>
            </div>
          </div>

          <img id="🔥LineY" src="@/assets/images/line-y.png">

          <div id="🔥CameraMapSelect">
            <AppInput dark class="w-1/6 relative left-[81%] mb-4" type="select" @click="changeFloorBg"
              :options="mapFloorList" v-model:modelInput="currentMapFloor" />
          </div>

          <template v-for="map in currentMapData" :key="map.uuid">
            <div id="🔥CameraMap" v-show="map.name">
              <img id="🔥CameraMap__Img" draggable="false" :src="map.img">
              <template v-for="camera in map.cameras" :key="camera.camera_id">

                <template v-for="livedevice in livedevices" :key="livedevice.camera_id">
                  <template v-if="livedevice.name === camera.name">
                    <img v-show="camera.checked" id="🔥CameraMap__LiveDot" src="@/assets/images/camera-live-active.png"
                      v-tooltip="camera.name"
                      draggable="false" @click="toggleImgLive(livedevice, camera)"
                      :style="`left: ${camera.position.x * 100}%; top: ${camera.position.y * 100}%`">
                    <img v-show="!camera.checked" id="🔥CameraMap__LiveDot" src="@/assets/images/camera-live.png"
                      v-tooltip="camera.name"
                      draggable="false" @click="toggleImgLive(livedevice, camera)"
                      :style="`left: ${camera.position.x * 100}%; top: ${camera.position.y * 100}%`">
                  </template>
                </template>

                <template v-for="device in devices" :key="device.camera_id">
                  <template v-if="device.name === camera.name">
                    <img v-show="camera.checked" id="🔥CameraMap__ArchiveDot"
                      src="@/assets/images/camera-archive-active.png" draggable="false"
                      v-tooltip="camera.name"
                      @click="toggleImgArch(device, camera)"
                      :style="`left: ${camera.position.x * 100}%; top: ${camera.position.y * 100}%`">
                    <img v-show="!camera.checked" id="🔥CameraMap__ArchiveDot" src="@/assets/images/camera-archive.png"
                      v-tooltip="camera.name"
                      @click="toggleImgArch(device, camera)" draggable="false"
                      :style="`left: ${camera.position.x * 100}%; top: ${camera.position.y * 100}%`">
                  </template>
                </template>
              </template>
            </div>
          </template>

        </section>
      </template>

    </FullLayout>
  </ProgressBarLayout>
</template>

<script setup>
import { ref, onMounted, watch, reactive, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import spiderman from '@/spiderman';

import useStore from '@/modules/target/stores/index';
import useDevices from '@/stores/devices';
import { ESTest } from 'escss-estest';

const router = useRouter();

const store = useStore();
const { confirmedFace } = storeToRefs(store);
const { setPage, getLicense, addTask } = store;

const devicesStore = useDevices();
const { devices, livedevices } = storeToRefs(devicesStore);

const liveChannelAmount = ref(0);
const archiveAmount = ref(0);
const currentMapFloor = ref('')

const searchQuery = ref('')
const mapData = ref([])
const currentMapData = computed(() => mapData.value.filter(item => item.name === currentMapFloor.value))
const currentMapDataCamerasBg = ref([])
const mapFloorList = ref({})

const form = reactive({
  target: {
    camera_id: confirmedFace.value.camera_id,
    timestamp: confirmedFace.value.timestamp,
  },
  target_face_id: confirmedFace.value.data.id || '',
  target_face_image: confirmedFace.value.data.face_image,
  feature: confirmedFace.value.data.feature || '',
  target_score: 0.5,
  search_motion: true,
  subtasks: [],
  // 多久抓一張圖
  search_interval_ms: 1000,

  // 以下是 UI 會控制
  search_end_time: spiderman.dayjs(confirmedFace.value.timestamp).add(11, 'minute').format('YYYY-MM-DD HH:mm'),
  search_start_time: spiderman
    .dayjs(confirmedFace.value.timestamp)
    .add(11, 'minute')
    .subtract(1, 'hour')
    .format('YYYY-MM-DD HH:mm'),
  task_name: `task-${spiderman.formatDate.dateStamp()}`,
  livechannels: [],
  archchannels: [],
});

const filterArchiveDevices = computed(() => {
  {
    ESTest(searchQuery.value, 'string')
    ESTest(devices.value, 'array')
  }

  if (!searchQuery.value) {
    return devices.value; // 如果搜尋框為空，顯示所有項目
  }
  return devices.value.filter(device =>
    device.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // 小寫比對
  )
})

const filterLiveDevices = computed(() => {
  {
    ESTest(searchQuery.value, 'string')
    ESTest(livedevices.value, 'array')
  }
  
  if (!searchQuery.value) {
    return livedevices.value; // 如果搜尋框為空，顯示所有項目
  }
  return livedevices.value.filter(liveDevice =>
    liveDevice.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // 小寫比對
  )
})

async function handleAddTask(theForm) {
  {
    ESTest(theForm, 'object')
    ESTest(spiderman, 'object')
    ESTest(router, 'object')
  }

  const taskForm = spiderman.lodash.cloneDeep(theForm);
  taskForm.search_start_time = spiderman.dayjs(theForm.search_start_time).valueOf();
  taskForm.search_end_time = spiderman.dayjs(theForm.search_end_time).valueOf();

  await addTask(taskForm);

  router.push({ path: '/investigation' });
}

function toggleImgLive(deviceData, cameraData) {
  {
    ESTest(deviceData, 'object')
    ESTest(cameraData, 'object')
    ESTest(form.livechannels, 'array')
  }

  // 點擊後 地圖 icon active
  if (cameraData.checked === false) {
    cameraData.checked = true
    form.livechannels.push(deviceData)
  }

  // 點擊後 地圖 icon inactive
  else {
    cameraData.checked = false
    form.livechannels = form.livechannels.filter(item => item.name !== deviceData.name)
  }
}

function toggleImgArch(deviceData, cameraData) {
  {
    ESTest(deviceData, 'object')
    ESTest(cameraData, 'object')
    ESTest(form.archchannels, 'array')
  }

  // 點擊後 地圖 icon active
  if (cameraData.checked === false) {
    cameraData.checked = true
    form.archchannels.push(deviceData)
  }

  // 點擊後 地圖 icon inactive
  else {
    cameraData.checked = false
    form.archchannels = form.archchannels.filter(item => item.name !== deviceData.name)
  }
}

function toggleClickLive(deviceData) {
  {
    ESTest(deviceData, 'object')
    ESTest(currentMapFloor.value, 'string')
    ESTest(currentMapDataCamerasBg.value, 'array')
    ESTest(form.livechannels, 'array')
    ESTest(mapData.value, 'array')
  }

  if (noSettingFloor()) {
    // 使用者沒有設定 所以給空畫面
    currentMapFloor.value = ''
    currentMapDataCamerasBg.value = []
  }

  else if (isSameFloor() === false) {
    changeFloor()
  }

  toggleCamera()


  function toggleCamera() {
    if (isRepeatedCamera()) {
      form.livechannels = form.livechannels.filter(item => item.name !== deviceData.name) // 更新攝影機
      mapData.value = toChecked(false) // 更新地圖 icon
    }
    else {
      form.livechannels.push(deviceData)
      mapData.value = toChecked(true)
    }
  }

  function changeFloor() {
    currentMapFloor.value = mapData.value.filter(item => item.uuid === deviceData.applyToMap[0])[0].name
    changeFloorBg()
  }

  function noSettingFloor() {
    return deviceData.applyToMap.length === 0
  }

  function isSameFloor() {
    return deviceData.applyToMap.includes(currentMapData.value[0]?.uuid)
  }

  function toChecked(boolean) {
    return mapData.value.map(item => ({
      ...item,
      cameras: item.cameras.map(item => {
        if (item.name === deviceData.name) {
          return {
            ...item,
            checked: boolean,
          }
        }

        else return item
      })
    }))
  }

  function isRepeatedCamera() {
    return form.livechannels.some(item => item.name === deviceData.name)
  }
}

function toggleClickArch(deviceData) {
  {
    ESTest(deviceData, 'object')
    ESTest(currentMapFloor.value, 'string')
    ESTest(currentMapDataCamerasBg.value, 'array')
    ESTest(form.archchannels, 'array')
    ESTest(mapData.value, 'array')
  }

  if (noSettingFloor()) {
    // 空畫面
    currentMapFloor.value = ''
    currentMapDataCamerasBg.value = []
  }

  else if (isSameFloor() === false) {
    changeFloor()
  }

  toggleCamera()

  function toggleCamera() {
    if (isRepeatedCamera()) {
      form.archchannels = form.archchannels.filter(item => item.name !== deviceData.name) // 更新攝影機
      mapData.value = toChecked(false) // 更新地圖 icon
    }
    else {
      form.archchannels.push(deviceData)
      mapData.value = toChecked(true)
    }
  }

  function changeFloor() {
    currentMapFloor.value = mapData.value.filter(item => item.uuid === deviceData.applyToMap[0])[0].name
    changeFloorBg()
  }

  function noSettingFloor() {
    return deviceData.applyToMap.length === 0
  }

  function isSameFloor() {
    return deviceData.applyToMap.includes(currentMapData.value[0]?.uuid)
  }

  function toChecked(boolean) {
    return mapData.value.map(item => ({
      ...item,
      cameras: item.cameras.map(item => {
        if (item.name === deviceData.name) {
          return {
            ...item,
            checked: boolean,
          }
        }

        else return item
      })
    }))
  }

  function isRepeatedCamera() {
    return form.archchannels.some(item => item.name === deviceData.name)
  }
}

function toCheckedAll(boolean, type) {
  {
    ESTest(boolean, 'boolean')
    ESTest(type, 'string')
    ESTest(mapData.value, 'array')
  }

  mapData.value = mapData.value.map(item => ({
    ...item,
    cameras: item.cameras.map(item => {
      if (item.type === type) {
        return {
          ...item,
          checked: boolean,
        }
      }

      else return item
    })
  }))
}

function getMapFloorList() {
  {
    ESTest(mapFloorList.value, 'object')
    ESTest(mapData.value, 'array')
  }

  mapFloorList.value = mapData.value?.reduce((accumulator, currentItem) => {
    // 每次迭代，currentItem 都是數組中的一個元素
    // accumulator 是累積的結果，初始值是 {}

    // 將當前 item 的 name 作為 key 和 value
    accumulator[currentItem.name] = currentItem.name;

    // 返回更新後的 accumulator
    return accumulator;
  }, {})
}

function changeFloorBg() {
  {
    ESTest(currentMapData.value, 'array')
  }

  currentMapDataCamerasBg.value = currentMapData.value[0]?.cameras.map(item => item.name)
}

async function fetchMaps() {
  try {
    // **第一步：取得所有地圖（不含圖片）**
    const maps = await store.getAllMaps();
    const mapsArray = maps.data
    // **第二步：遍歷所有地圖，根據 `uuid` 取得圖片**
    const mapsWithImages = await Promise.all(
      mapsArray.map(async (item) => {
        try {
          const image = await store.getMapImage(item.uuid);
          const img = `data:image/png;base64, ${image.background}`

          return {
            ...item,
            cameras: item.cameras.map(i => ({ ...i, checked: false })),
            img
          }; // 合併圖片, 新增 checked: 屬性
        } catch (error) {
          console.error(`取得地圖圖片失敗 (UUID: ${item.uuid})`, error);
          return { ...item, img: null }; // 取得圖片失敗時，設為 `null`
        }
      })
    );

    // **第三步：更新表格數據**
    mapData.value = mapsWithImages;
  } catch (error) {
    console.error("取得地圖資料失敗:", error);
  }
}

watch(() => form.search_start_time, () => {
  const start = spiderman.dayjs(form.search_start_time);
  const end = spiderman.dayjs(form.search_end_time);
  if (start.isAfter(end)) {
    form.search_end_time = start.add(1, 'hour').format('YYYY-MM-DD HH:mm');
  }
});

watch(() => form.search_end_time, () => {
  const start = spiderman.dayjs(form.search_start_time);
  const end = spiderman.dayjs(form.search_end_time);
  if (end.isBefore(start)) {
    form.search_start_time = end.subtract(1, 'hour').format('YYYY-MM-DD HH:mm');
  }
});

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

  archiveAmount.value = validLicenses.some(({ frs }) => frs) ? 999 : 0;

  fetchMaps()

  const archiveDevices = await store.getAllArchDevices()
  devices.value = archiveDevices.data

  // 顯示樓層下拉選單
  getMapFloorList()

  // 預設顯示 地圖樓層資料的第一筆
  currentMapFloor.value = Object.keys(mapFloorList.value)[0]

  // 抓取當前樓層 camera name
  changeFloorBg()
});
</script>

<style>
#🔥TargetPerson__Img {
  grid-area: 🔥TargetPerson__Img;
  object-fit: contain;
  width: 100%;
  height: 100%;
}

#🔥TargetPerson__TaskName {
  grid-area: 🔥TargetPerson__TaskName;
  margin-left: 40px;
}

#🔥TargetPerson__X {
  grid-area: 🔥TargetPerson__X;
  display: flex;
  gap: 0.5rem;
  margin-top: 5px;
}

#🔥TargetPerson__X__StartTime {
  width: 100%;
  margin-left: 40px;
}

#🔥TargetPerson__X__EndTime {
  width: 100%;
}

#🔥TargetPerson__Search {
  grid-area: 🔥TargetPerson__Search;
  margin-left: 40px;
  margin-top: 5px;
}

#🔥CameraList__X {
  display: flex;
  gap: 1rem;
  height: 94.5%;
}

#🔥CameraList__X2 {
  display: flex;
  justify-content: right;
}

#🌀TargetPage {
  display: grid;
  grid-template-columns: repeat(20, 1fr);
  grid-template-rows: repeat(20, 1fr);
  width: 100%;
  height: 100%;
  padding: 1.5rem;
}

#🔥TargetPerson {
  display: grid;
  grid-template-areas:
    "🔥TargetPerson__Img 🔥TargetPerson__TaskName"
    "🔥TargetPerson__Img 🔥TargetPerson__X"
    "🔥TargetPerson__Img 🔥TargetPerson__Search";
  grid-template-columns: 15% 85%;
  grid-column: 4 / 18;
}

#🔥LineX {
  width: 100%;
  grid-column: 1 / -1;
  grid-row: 2 / 3;
  position: relative;
  top: 50%;
}

#🔥CameraList {
  grid-column: 1 / 7;
  grid-row: 3 / -1;
}

#🔥LineY {
  height: 100%;
  grid-column: 7 / span 1;
  grid-row: 3 / -1;
  position: relative;
  left: 50%;
}

#🔥CameraMapSelect {
  position: relative;
  grid-column: 8 / -1;
  grid-row: 3 / 4;
}

#🔥CameraMap {
  position: relative;
  grid-column: 8 / -1;
  grid-row: 4 / -1;
  transform: scale(0.95);
}

#🔥CameraMap__Img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: 100%;
}

#🔥CameraMap__LiveDot {
  position: absolute;
  width: 24px;
  height: 24px;
  user-select: none;
}

#🔥CameraMap__ArchiveDot {
  position: absolute;
  width: 24px;
  height: 24px;
  user-select: none;
}

.bg-camera-live {
  background: #6c98dd;
}

.bg-camera-archive {
  background: #c69b51;
}
</style>