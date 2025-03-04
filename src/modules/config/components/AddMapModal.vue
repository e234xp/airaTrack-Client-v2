<template>
  <ModalLayout :is-open="modal === 'add-map'" @close="setModal('')" width="80vw" height="75vh">
    <template #header>
      {{ $t('AddMap') }}
    </template>

    <template #description>
      {{ stepDescription }}
    </template>

    <template #default>
      <div v-if="currentStep === 1">
        <!-- 輸入地圖名稱 -->
        <AppLabel :label="$t('MapName')">
          <input v-model="mapName" type="text" placeholder="請輸入地圖名稱" class="mt-2 w-full p-2 border rounded" />
        </AppLabel>
        <!-- 上傳地圖圖片 -->
        <AppLabel :label="$t('UploadMap')" class="mt-2">
          <input type="file" accept="image/*" class="mt-2 w-full p-2 border rounded" @change="onUploadMap" />
        </AppLabel>
        <img v-if="mapImage" :src="mapImage" class="mt-4 w-full h-96 object-contain border" />
      </div>

      <div v-if="currentStep === 2">
        <AppLabel :label="$t('Search')">
          <input type="search" placeholder="Please enter the camera name" v-model="searchQuery"
            class="h-[37px] w-full rounded-sm bg-[#3b3b3b] border border-gray-500 text-white focus:outline-none p-4">
        </AppLabel>
        <div class="flex gap-8">
          <!-- 即時攝影機 -->
          <div class="w-full border rounded bg-black p-4 overflow-auto">
            <h3 class="text-xl text-white border-b-2 border-live-channel pb-2">
              {{ $t('LiveChannel') }} ({{ selectedLiveCameras.length }}/{{ livedevices.length }})
            </h3>

            <!-- 全選按鈕 -->
            <AppCheckBox class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
              :placeholder="$t('All')" :checked="selectedLiveCameras.length === filteredLiveCameras.length"
              @on-change="toggleSelectLive">{{ $t('All') }}</AppCheckBox>

            <!-- 列出即時攝影機 -->
            <AppCheckBox v-for="camera in filteredLiveCameras" :key="camera.camera_id" class="mb-2 text-xl text-white"
              :placeholder="camera.name" v-model:modelInput="selectedLiveCameras" :value="camera">
              {{ camera.name }}
            </AppCheckBox>
          </div>

          <!-- 錄影攝影機 -->
          <div class="w-full border rounded bg-black p-4 overflow-auto">
            <h3 class="text-xl text-white border-b-2 border-archive-channel pb-2">
              {{ $t('NxVideoArchive') }} ({{ selectedArchiveCameras.length }}/{{ devices.length }})
            </h3>
            <!-- 全選按鈕 -->
            <AppCheckBox class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
              :placeholder="$t('All')" :checked="selectedArchiveCameras.length === filteredArchiveCameras.length"
              @on-change="toggleSelectArchive">{{ $t('All') }}</AppCheckBox>

            <!-- 列出錄影攝影機 -->
            <AppCheckBox v-for="camera in filteredArchiveCameras" :key="camera.camera_id"
              class="mb-2 text-xl text-white" :placeholder="camera.name" v-model:modelInput="selectedArchiveCameras"
              :value="camera">
              {{ camera.name }}
            </AppCheckBox>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 3">
        <h3 class="mb-2">{{ $t('PlaceCamerasOnMap') }}</h3>
        <div class="relative border w-full aspect-video bg-gray-200" @dragover.prevent>
          <div v-if="mapImage" class="relative w-full h-full">
            <img ref="imgRef" :src="mapImage" class="absolute top-0 left-0 w-full h-full object-contain"
              @load="onImageLoad" />

            <!-- 即時攝影機 (Live) -->
            <div v-for="(camera, index) in selectedLiveCameras" :key="camera.camera_id" class="absolute cursor-pointer"
              :style="{ left: camera.x + 'px', top: camera.y + 'px' }" draggable="true"
              @dragstart="startDrag($event, camera)" @drag="onDragging($event, camera)"
              @dragend="endDrag($event, camera)">

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <img v-bind="props" src="@/assets/images/camera-live.png" class="w-6 h-6" draggable="false" />
                </template>
                {{ camera.name }}
              </v-tooltip>
              <v-icon color="red" @click="removeCamera(camera, 'live')" class="absolute top-[-40px] right-[-10px]">
                mdi-close-circle
              </v-icon>
            </div>

            <!-- 錄影攝影機 (Archive) -->
            <div v-for="(camera, index) in selectedArchiveCameras" :key="camera.camera_id"
              class="absolute cursor-pointer" :style="{ left: camera.x + 'px', top: camera.y + 'px' }" draggable="true"
              @dragstart="startDrag($event, camera)" @drag="onDragging($event, camera)"
              @dragend="endDrag($event, camera)">

              <v-tooltip location="top">
                <template v-slot:activator="{ props }">
                  <img v-bind="props" src="@/assets/images/camera-archive.png" class="w-6 h-6" draggable="false" />
                </template>
                {{ camera.name }}
              </v-tooltip>
              <v-icon color="red" @click="removeCamera(camera, 'archive')" class="absolute top-[-40px] right-[-10px]">
                mdi-close-circle
              </v-icon>
            </div>
          </div>
        </div>
      </div>

      <div v-if="currentStep === 4">
        <!-- 完成步驟 -->
        <h3 class="mb-2">{{ $t('FinalMapPreview') }}</h3>
        <div class="relative border w-full aspect-video bg-gray-200">
          <img v-if="mapImage" :src="mapImage" class="absolute top-0 left-0 w-full h-full object-contain" />
          <div v-for="camera in selectedLiveCameras" :key="camera.camera_id" class="absolute"
            :style="{ left: camera.x + 'px', top: camera.y + 'px' }">
            <img src="@/assets/images/camera-live.png" class="w-6 h-6" />

          </div>
          <div v-for="camera in selectedArchiveCameras" :key="camera.camera_id" class="absolute"
            :style="{ left: camera.x + 'px', top: camera.y + 'px' }">
            <img src="@/assets/images/camera-archive.png" class="w-6 h-6" />

          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <AppButton v-if="currentStep > 1" type="secondary" class="px-6" @click="prevStep">
          {{ $t('Previous') }}
        </AppButton>

        <AppButton v-if="currentStep < 4" type="primary" class="px-6" @click="nextStep">
          {{ $t('Next') }}
        </AppButton>

        <AppButton v-if="currentStep === 4" type="primary" class="px-6" @click="onSaveMap">
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useDevices from '@/stores/devices';

const devicesStore = useDevices();
const { devices, livedevices } = storeToRefs(devicesStore);

// 存儲使用者選擇的攝影機
const selectedLiveCameras = ref([]);
const selectedArchiveCameras = ref([]);
const searchQuery = ref('')

const modal = ref('');
const currentStep = ref(1);
const mapImage = ref(null);
const mapName = ref('')
const imgRef = ref(null);
// 記錄拖曳偏移
let offsetX = 0;
let offsetY = 0;


const imgWidth = ref(0);
const imgHeight = ref(0);


function onImageLoad() {
  if (imgRef.value) {
    imgWidth.value = imgRef.value.clientWidth;
    imgHeight.value = imgRef.value.clientHeight;
    console.log("📸 Image loaded! Initial size:", imgWidth.value, imgHeight.value);
  }
}

const filteredArchiveCameras = computed(() => {
  if (!searchQuery.value) {
    return devices.value; // 如果搜尋框為空，顯示所有項目
  }
  return devices.value.filter(device =>
    device.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // 小寫比對
  )
});

const filteredLiveCameras = computed(() => {
  if (!searchQuery.value) {
    return livedevices.value; // 如果搜尋框為空，顯示所有項目
  }
  return livedevices.value.filter(liveDevice =>
    liveDevice.name.toLowerCase().includes(searchQuery.value.toLowerCase()) // 小寫比對
  )
});

const stepDescription = computed(() => {
  switch (currentStep.value) {
    case 1: return '請上傳地圖圖片';
    case 2: return '請選擇需要加入地圖的攝影機';
    case 3: return '請拖拉攝影機到地圖上的適當位置';
    case 4: return '這是最終的地圖預覽';
    default: return '';
  }
});

// **重設所有表單數據**
function resetForm() {
  mapName.value = '';
  mapImage.value = null;
  selectedLiveCameras.value = [];
  selectedArchiveCameras.value = [];
  currentStep.value = 1;
}


function setModal(val) {
  if (val === '') {
    resetForm(); // 關閉時清空表單
  }
  modal.value = val;
}


// 全選 / 取消全選 即時攝影機
function toggleSelectLive() {
  if (selectedLiveCameras.value.length === livedevices.value.length) {
    selectedLiveCameras.value = [];
  } else {
    selectedLiveCameras.value = [...livedevices.value];
  }
}

// 全選 / 取消全選 錄影攝影機
function toggleSelectArchive() {
  if (selectedArchiveCameras.value.length === devices.value.length) {
    selectedArchiveCameras.value = [];
  } else {
    selectedArchiveCameras.value = [...devices.value];
  }
}

function onUploadMap(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function (e) {
    const img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      const originalWidth = img.width;
      const originalHeight = img.height;
      const originalAspectRatio = originalWidth / originalHeight;
      const targetAspectRatio = 16 / 9;

      let targetWidth, targetHeight;
      if (originalAspectRatio > targetAspectRatio) {
        // 圖片太寬：以寬為基準，計算應該補充的高度
        targetWidth = originalWidth;
        targetHeight = originalWidth / targetAspectRatio;
      } else {
        // 圖片太高：以高為基準，計算應該補充的寬度
        targetHeight = originalHeight;
        targetWidth = originalHeight * targetAspectRatio;
      }

      const canvas = document.createElement("canvas");
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext("2d");

      // 設定背景為白色
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, targetWidth, targetHeight);

      // 計算圖片的居中位置
      const offsetX = (targetWidth - originalWidth) / 2;
      const offsetY = (targetHeight - originalHeight) / 2;

      // 把圖片畫到 Canvas（加上白邊）
      ctx.drawImage(img, offsetX, offsetY, originalWidth, originalHeight);

      // 轉換為 Base64
      const base64Image = canvas.toDataURL("image/jpeg", 0.9); // 0.9 代表壓縮品質

      // 存到變數
      mapImage.value = base64Image;
    };
  };
}


function nextStep() {
  if (currentStep.value < 4) currentStep.value++;
}

function prevStep() {
  if (currentStep.value > 1) currentStep.value--;
}

// ✅ **移除 computed，改用手動初始化**
function initializeCameraPositions() {
  const spacingX = 30;
  const spacingY = 30;
  const startX = 50;

  selectedLiveCameras.value = selectedLiveCameras.value.map((camera, index) => ({
    ...camera,
    x: camera.x ?? startX + (index % 5) * spacingX,
    y: camera.y ?? 50 + Math.floor(index / 5) * spacingY,
  }));

  selectedArchiveCameras.value = selectedArchiveCameras.value.map((camera, index) => ({
    ...camera,
    x: camera.x ?? startX + (index % 5) * spacingX,
    y: camera.y ?? 100 + Math.floor(index / 5) * spacingY,
  }));
}

// **監聽 step 進入拖拉攝影機時，初始化位置**
watch(currentStep, (newStep) => {
  if (newStep === 3) {
    initializeCameraPositions();
  }
});

// **拖曳開始**
function startDrag(event, camera) {
  const rect = event.target.getBoundingClientRect();
  offsetX = event.clientX - rect.left;
  offsetY = event.clientY - rect.top;
  camera.dragging = true;
}

// **拖曳過程**
function onDragging(event, camera) {
  if (!camera.dragging) return;

  const mapRect = event.target.closest('.relative').getBoundingClientRect();
  camera.x = event.clientX - mapRect.left - offsetX;
  camera.y = event.clientY - mapRect.top - offsetY;

  // ✅ **確保 Vue 重新渲染**
  selectedLiveCameras.value = [...selectedLiveCameras.value];
  selectedArchiveCameras.value = [...selectedArchiveCameras.value];
}

// **拖曳結束**
function endDrag(event, camera) {
  camera.dragging = false;

  const mapRect = event.target.closest('.relative').getBoundingClientRect();
  camera.x = event.clientX - mapRect.left - offsetX;
  camera.y = event.clientY - mapRect.top - offsetY;

  let cameraList = selectedLiveCameras.value.find(c => c.camera_id === camera.camera_id)
    ? selectedLiveCameras
    : selectedArchiveCameras;

  const cameraIndex = cameraList.value.findIndex(c => c.camera_id === camera.camera_id);
  if (cameraIndex !== -1) {
    cameraList.value[cameraIndex].x = camera.x;
    cameraList.value[cameraIndex].y = camera.y;
  }
  console.log(camera.x, camera.y)
  // ✅ **強制 Vue 重新渲染**
  selectedLiveCameras.value = [...selectedLiveCameras.value];
  selectedArchiveCameras.value = [...selectedArchiveCameras.value];
}
function removeCamera(camera, type) {
  if (type === 'live') {
    selectedLiveCameras.value = selectedLiveCameras.value.filter(c => c.camera_id !== camera.camera_id);
  } else if (type === 'archive') {
    selectedArchiveCameras.value = selectedArchiveCameras.value.filter(c => c.camera_id !== camera.camera_id);
  }
}

function onSaveMap() {

  const imageWidth = imgWidth.value
  const imageHeight = imgHeight.value

  // 轉換 Live 攝影機座標為相對比例
  const relativeLiveCameras = selectedLiveCameras.value.map(camera => ({
    camera_id: camera.camera_id,
    name: camera.name,
    relativeX: camera.x / imageWidth, // 轉換為 0 ~ 1 之間的比例
    relativeY: camera.y / imageHeight
  }));

  // 轉換 Archive 攝影機座標為相對比例
  const relativeArchiveCameras = selectedArchiveCameras.value.map(camera => ({
    camera_id: camera.camera_id,
    name: camera.name,
    relativeX: camera.x / imageWidth,
    relativeY: camera.y / imageHeight
  }));

  // 最終儲存的資料
  const saveData = {
    mapName: mapName.value,
    mapImage: mapImage.value, // Base64 圖片
    cameras: {
      live: relativeLiveCameras,
      archive: relativeArchiveCameras
    }
  };

  console.log("🚀 Sending data to backend:", saveData);

  // 這裡你可以將 `saveData` 傳給 API
  // axios.post('/api/save-map', saveData).then(...).catch(...);
  localStorage.setItem('map', JSON.stringify(saveData))


  resetForm(); // 儲存後清空表單
  setModal('');
}

// 🔥 這一行很重要！讓父組件可以呼叫 setModal()
defineExpose({ setModal });
</script>

<style>
.delete-btn {
  width: 4px !important;
  height: 4px !important;
  min-width: 4px !important;
}
</style>
