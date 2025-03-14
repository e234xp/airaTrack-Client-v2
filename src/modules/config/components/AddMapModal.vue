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
          <p v-if="mapNameError" class="text-red-500 text-sm mt-1">{{ $t('MapNameMustHave') }}</p>
      </AppLabel>
        <!-- 上傳地圖圖片 -->
        <AppLabel :label="$t('UploadMap')" class="mt-2">
          <input type="file" accept="image/*" class="mt-2 w-full p-2 border rounded file:bg-white file:text-black" @change="onUploadMap" />
          <p v-if="mapImageError" class="text-red-500 text-sm mt-1">{{ $t('MapImageMustHave') }}</p>
        </AppLabel>
        <img v-if="mapImage" :src="mapImage" class="mt-4 w-full change-height object-contain" />
      </div>

      <div v-if="currentStep === 2" class="flex gap-4">
          <!-- 即時攝影機 -->
          <div class="w-1/2 border rounded bg-black p-4 overflow-auto">
          <h3 class="text-xl text-white border-b-2 border-blue-500 pb-2">
              {{ $t('LiveChannel') }} ({{ selectedLiveCameras.length }}/{{ livedevices.length }})
          </h3>
          <input
          v-model="searchLive"
          type="text"
          class="w-full p-2 mb-2 border rounded text-white"
          :placeholder="$t('Search')"
      />

          <!-- 全選按鈕 -->
          <AppCheckBox
              class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
              :placeholder="$t('All')"
              :checked="selectedLiveCameras.length === filteredLiveCameras.length"
              @on-change="toggleSelectLive"
          >{{ $t('All') }}</AppCheckBox>

          <!-- 列出即時攝影機 -->
          <AppCheckBox
              v-for="camera in filteredLiveCameras"
              :key="camera.camera_id"
              class="mb-2 text-xl text-white"
              :placeholder="camera.name"
              v-model:modelInput="selectedLiveCameras"
              :value="camera"
          >
              {{ camera.name }}
          </AppCheckBox>
          </div>

          <!-- 錄影攝影機 -->
          <div class="w-1/2 border rounded bg-black p-4 overflow-auto">
          <h3 class="text-xl text-white border-b-2 border-green-500 pb-2">
              {{ $t('NxVideoArchive') }} ({{ selectedArchiveCameras.length }}/{{ archdevices.length }})
          </h3>
          <input
          v-model="searchArchive"
          type="text"
          class="w-full p-2 mb-2 border rounded text-white"
          :placeholder="$t('Search')"
      />
          <!-- 全選按鈕 -->
          <AppCheckBox
              class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
              :placeholder="$t('All')"
              :checked="selectedArchiveCameras.length === filteredArchiveCameras.length"
              @on-change="toggleSelectArchive"
          >{{ $t('All') }}</AppCheckBox>

          <!-- 列出錄影攝影機 -->
          <AppCheckBox
              v-for="camera in filteredArchiveCameras"
              :key="camera.camera_id"
              class="mb-2 text-xl text-white"
              :placeholder="camera.name"
              v-model:modelInput="selectedArchiveCameras"
              :value="camera"
          >
              {{ camera.name }}
          </AppCheckBox>
          </div>
      </div>

      <div v-if="currentStep === 3">
              <h3 class="mb-2">{{ $t('PlaceCamerasOnMap') }}</h3>
              <div class="relative border w-full aspect-video" @dragover.prevent>
                  <div v-if="mapImage" class="relative w-full h-full">
                      <img ref="imgRef" :src="mapImage" class="absolute top-0 left-0 w-full h-full" @load="onImageLoad"/>

                      <!-- 即時攝影機 (Live) -->
                      <div v-for="(camera, index) in selectedLiveCameras" :key="camera.camera_id"
                          class="absolute cursor-pointer"
                          :style="{ left: camera.x + 'px', top: camera.y + 'px' }"
                          draggable="true"
                          @dragstart="startDrag($event, camera)"
                          @drag="onDragging($event, camera)"
                          @dragend="endDrag($event, camera)">
                          
                          <v-tooltip location="top">
                              <template v-slot:activator="{ props }">
                                <img v-bind="props" src="@/assets/images/camera-live.png" class="w-6 h-6" draggable="false" />
                              </template>
                              {{ camera.name }}
                          </v-tooltip>
                          <v-icon color="red" @click="removeCamera(camera, 'live')"
                              class="absolute top-[-40px] right-[-10px]">
                              mdi-close-circle
                          </v-icon>
                      </div>

                      <!-- 錄影攝影機 (Archive) -->
                      <div v-for="(camera, index) in selectedArchiveCameras" :key="camera.camera_id"
                          class="absolute cursor-pointer"
                          :style="{ left: camera.x + 'px', top: camera.y + 'px' }"
                          draggable="true"
                          @dragstart="startDrag($event, camera)"
                          @drag="onDragging($event, camera)"
                          @dragend="endDrag($event, camera)">

                          <v-tooltip location="top">
                              <template v-slot:activator="{ props }">
                                <img v-bind="props" src="@/assets/images/camera-archive.png" class="w-6 h-6" draggable="false" />
                              </template>
                              {{ camera.name }}
                          </v-tooltip>
                          <v-icon color="red" @click="removeCamera(camera, 'archive')"
                              class="absolute top-[-40px] right-[-10px]">
                              mdi-close-circle
                          </v-icon>
                      </div>
                  </div>
              </div>
          </div>

      <div v-if="currentStep === 4">
        <!-- 完成步驟 -->
        <h3 class="mb-2">{{ $t('FinalMapPreview') }}</h3>
        <div class="relative border w-full aspect-video">
          <img v-if="mapImage" :src="mapImage" class="absolute top-0 left-0 w-full h-full" />
          <div v-for="(camera, index) in selectedLiveCameras" :key="camera.camera_id"
            class="absolute"
            :style="{ left: camera.x + 'px', top: camera.y + 'px' }">
            <img src="@/assets/images/camera-live.png" class="w-6 h-6" />
            
          </div>
          <div v-for="(camera, index) in selectedArchiveCameras" :key="camera.camera_id"
            class="absolute"
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
import { ref, computed ,watch, onMounted} from 'vue';
import useStore from '@/modules/config/stores/index';
import successStore from '@/components/AppSuccess/success';



const store = useStore();
const livedevices = ref([])
const archdevices = ref([])
const selectedLiveCameras = ref([]);
const selectedArchiveCameras = ref([]);

const searchLive = ref('');
const searchArchive = ref('');

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

const mapNameError = ref(false);
const mapImageError = ref(false);

const emit = defineEmits(["fetch-maps"]);

watch(mapName, (val) => {
  if (val.trim()) mapNameError.value = false;
});
watch(mapImage, (val) => {
  if (val) mapImageError.value = false;
});

// **當進入步驟 2 時，調用 API**
watch(currentStep, async (newStep) => {
  if (newStep === 2) {
    console.log("🔍 進入步驟 2，開始取得攝影機列表...");

    try {
      // 呼叫 API 獲取資料
      const result1 = await store.getAllLiveDevices();
      const result2 = await store.getAllArchDevices();

      // 🔹 過濾出 `applyToMap` 為空陣列的攝影機
      livedevices.value = result1.data.filter(device => 
        Array.isArray(device.applyToMap) && device.applyToMap.length === 0
      );

      archdevices.value = result2.data.filter(device => 
        Array.isArray(device.applyToMap) && device.applyToMap.length === 0
      );
      console.log("result", result1.data, result2.data);
      console.log("✅ 過濾後的攝影機數據:", livedevices.value, archdevices.value);
    } catch (error) {
      console.error("❌ 獲取攝影機列表失敗:", error);
    }
  }
});
function onImageLoad() {
if (imgRef.value) {
  imgWidth.value = imgRef.value.clientWidth;
  imgHeight.value = imgRef.value.clientHeight;
  console.log("📸 Image loaded! Initial size:", imgWidth.value, imgHeight.value);
      }
  }

// ✅ 根據 `searchLive` 來篩選即時攝影機
const filteredLiveCameras = computed(() => {
  return livedevices.value.filter(camera =>
      camera.name.toLowerCase().includes(searchLive.value.toLowerCase())
  );
});

// ✅ 根據 `searchArchive` 來篩選錄影攝影機
const filteredArchiveCameras = computed(() => {
  return archdevices.value.filter(camera =>
      camera.name.toLowerCase().includes(searchArchive.value.toLowerCase())
  );
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
if (selectedArchiveCameras.value.length === archdevices.value.length) {
  selectedArchiveCameras.value = [];
} else {
  selectedArchiveCameras.value = [...archdevices.value];
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
  if (currentStep.value === 1) {
    mapNameError.value = !mapName.value.trim();
    mapImageError.value = !mapImage.value;

    if (mapNameError.value || mapImageError.value) return;
  }

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
console.log(camera.x,camera.y)
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



async function onSaveMap() {
  const imageWidth = imgWidth.value;
  const imageHeight = imgHeight.value;

  // 轉換 Live 攝影機座標為相對比例
  const relativeLiveCameras = selectedLiveCameras.value.map(camera => ({
      type: "live",
      module: camera.module ?? "boxcam", // 預設為 boxcam，若有其他模組請自行修改
      camera_id: camera.camera_id,
      name: camera.name,
      position: {
          x: parseFloat((camera.x / imageWidth).toFixed(3)), // 保留 3 位小數
          y: parseFloat((camera.y / imageHeight).toFixed(3))
      }
  }));

  // 轉換 Archive 攝影機座標為相對比例
  const relativeArchiveCameras = selectedArchiveCameras.value.map(camera => ({
      type: "archive",
      module: camera.module ?? "bulletcam", // 預設為 bulletcam，若有其他模組請自行修改
      camera_id: camera.camera_id,
      name: camera.name,
      position: {
          x: parseFloat((camera.x / imageWidth).toFixed(3)),
          y: parseFloat((camera.y / imageHeight).toFixed(3))
      }
  }));

  // 最終儲存的資料
  const saveData = {
      name: mapName.value,
      background: mapImage.value, // Base64 圖片
      cameras: [...relativeLiveCameras, ...relativeArchiveCameras] // 合併 Live & Archive
  };

  console.log(" Sending data to backend:", saveData);

  try {
      const result = await store.postMaps(saveData);
      console.log("API Response:", result);

      if (result) {
          // ✅ 通知父組件重新抓取地圖列表
          emit("fetch-maps");

          // ✅ 關閉 modal
          setModal('');

          // ✅ 顯示成功通知
          successStore.show();
      }
  } catch (error) {
      console.error("儲存地圖失敗:", error);
  }

  resetForm();
}

// 🔥 這一行很重要！讓父組件可以呼叫 setModal()
defineExpose({ setModal });
</script>


<style>
.change-height {
  height: clamp(12rem, 10vw + 6rem, 24rem);
}
.delete-btn {
width: 4px !important;
height: 4px !important;
min-width: 4px !important;
}
</style>

