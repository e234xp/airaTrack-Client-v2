<template>
    <ModalLayout :is-open="isOpen" @close="closeModal" width="80vw" height="75vh">
      <template #header>
        {{ $t('EditMap') }}
      </template>
  
      <template #description>
        {{ stepDescription }}
      </template>
  
      <template #default>
        <!-- 🔵 **步驟 1: 編輯地圖基本資訊** -->
        <div v-if="currentStep === 1">
            <AppLabel :label="$t('MapName')">
                <input v-model="editedMap.name" type="text" class="mt-2 w-full p-2 border rounded" />
                <p v-if="mapNameError" class="text-red-500 text-sm mt-1">{{ $t('MapNameMustHave') }}</p>
            </AppLabel>

            <AppLabel :label="$t('UUID')" class="mt-2">
                <input v-model="editedMap.uuid" type="text" class="w-full p-2 border rounded" disabled />
            </AppLabel>

            <AppLabel :label="$t('UploadMap')" class="mt-2">
                <input type="file" accept="image/*" class="mt-2 w-full p-2 border rounded file:bg-white file:text-black" @change="onUploadMap" />
                <p v-if="mapImageError" class="text-red-500 text-sm mt-1">{{ $t('MapImageMustHave') }}</p>
            </AppLabel>
            
            <img v-if="mapImage" :src="mapImage" class="mt-4 w-full change-height object-contain" />
        </div>
  
        <!-- 🔵 **步驟 2: 選擇攝影機** -->
        <div v-if="currentStep === 2" class="flex gap-4">
            <div class="w-1/2 border rounded bg-black p-4 overflow-auto">
                <h3 class="text-xl text-white border-b-2 border-[#8fb5ec] pb-2">
                    {{ $t('LiveChannel') }} ({{ selectedLiveCameras.length }}/{{ livedevices.length }})
                </h3>
                <input v-model="searchLive" type="text" class="w-full p-2 mb-2 border rounded text-white" :placeholder="$t('Search')" />

                <AppCheckBox
                    class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
                    :checked="selectedLiveCameras.length === filteredLiveCameras.length"
                    @on-change="toggleSelectLive"
                >{{ $t('All') }}</AppCheckBox>

                <AppCheckBox
                    v-for="camera in filteredLiveCameras"
                    :key="camera.camera_id"
                    class="mb-2 text-xl text-white"
                    v-model:modelInput="selectedLiveCameras"
                    :value="camera"
                >
                    {{ camera.name }}
                </AppCheckBox>
            </div>

            <div class="w-1/2 border rounded bg-black p-4 overflow-auto">
                <h3 class="text-xl text-white border-b-2 border-[#f1c984] pb-2">
                    {{ $t('NxVideoArchive') }} ({{ selectedArchiveCameras.length }}/{{ archdevices.length }})
                </h3>
                <input v-model="searchArchive" type="text" class="w-full p-2 mb-2 border rounded text-white" :placeholder="$t('Search')" />

                <AppCheckBox
                    class="pb-2 mb-2 text-xl text-white border-b-2 border-dashed border-panel"
                    :checked="selectedArchiveCameras.length === filteredArchiveCameras.length"
                    @on-change="toggleSelectArchive"
                >{{ $t('All') }}</AppCheckBox>

                <AppCheckBox
                    v-for="camera in filteredArchiveCameras"
                    :key="camera.camera_id"
                    class="mb-2 text-xl text-white"
                    v-model:modelInput="selectedArchiveCameras"
                    :value="camera"
                >
                    {{ camera.name }}
                </AppCheckBox>
            </div>
        </div>
  
        <!-- 🔵 **步驟 3: 拖拉攝影機到地圖** -->
        <div v-if="currentStep === 3">
            <h3 class="mb-2">{{ $t('PlaceCamerasOnMap') }}</h3>
            <div class="relative border w-full aspect-video" @dragover.prevent>
                <div v-if="mapImage" class="relative w-full h-full">
                    <img ref="imgRef" :src="mapImage" class="absolute top-0 left-0 w-full h-full" @load="onImageLoad"/>

                    <div v-for="camera in selectedLiveCameras" :key="camera.camera_id"
                        class="absolute cursor-pointer"
                        :style="{ left: camera.x + 'px', top: camera.y + 'px' }"
                        draggable="true"
                        @dragstart="startDrag($event, camera)"
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

                    <div v-for="camera in selectedArchiveCameras" :key="camera.camera_id"
                        class="absolute cursor-pointer"
                        :style="{ left: camera.x + 'px', top: camera.y + 'px' }"
                        draggable="true"
                        @dragstart="startDrag($event, camera)"
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

        <!-- 🔵 **步驟 4: 預覽編輯後的地圖** -->
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
import { ref, computed, defineProps, defineEmits, watch } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/config/stores/index';
import useDevices from '@/stores/devices';
import successStore from '@/components/AppSuccess/success';



const livedevices = ref([])
const archdevices = ref([])
 // 存儲使用者選擇的攝影機
const selectedLiveCameras = ref([]);
const selectedArchiveCameras = ref([]);

const searchLive = ref('');
const searchArchive = ref('');

const store = useStore();
const props = defineProps({
    isOpen: Boolean,
    selectedMap: Object,
});
const emit = defineEmits(["update:isOpen", "fetch-maps"]);
const currentStep = ref(1);
const editedMap = ref({});
const mapImage = ref(null);
const imgRef = ref(null);
let offsetX = 0;
let offsetY = 0;
const imgWidth = ref(0);
const imgHeight = ref(0);
const mapNameError = ref(false);
const mapImageError = ref(false);

watch(editedMap.name, (val) => {
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
        console.log('result1',result1)
      // 取得當前編輯的地圖 UUID
      const currentMapUUID = editedMap.value.uuid;
      console.log("🆔 當前地圖 UUID:", currentMapUUID);

      // 🔹 過濾 `applyToMap` 為空陣列或包含當前 UUID 的攝影機
      livedevices.value = result1.data.filter(device => 
        Array.isArray(device.applyToMap) && 
        (device.applyToMap.length === 0 || device.applyToMap.includes(currentMapUUID))
      );

      archdevices.value = result2.data.filter(device => 
        Array.isArray(device.applyToMap) && 
        (device.applyToMap.length === 0 || device.applyToMap.includes(currentMapUUID))
      );

      console.log("result", result1.data, result2.data);
      console.log("✅ 過濾後的攝影機數據:", livedevices.value, archdevices.value);

      matchExistingCameras();
    } catch (error) {
      console.error("❌ 獲取攝影機列表失敗:", error);
    }
  }
});

function matchExistingCameras() {
  if (!props.selectedMap || !Array.isArray(props.selectedMap.cameras)) return;

  console.log("🔄 開始匹配已存在的攝影機...");
  
  // ✅ 依據 selectedMap 來篩選已存在的攝影機
  selectedLiveCameras.value = livedevices.value.filter(device => 
    props.selectedMap.cameras.some(c => c.camera_id === device.camera_id && c.type.trim() === "live")
  );

  selectedArchiveCameras.value = archdevices.value.filter(device => 
    props.selectedMap.cameras.some(c => c.camera_id === device.camera_id && c.type.trim() === "archive")
  );

  // ✅ 更新已選攝影機的 x, y 座標
  selectedLiveCameras.value.forEach(device => {
    const cameraData = props.selectedMap.cameras.find(c => c.camera_id === device.camera_id);
    
    if (cameraData) {
      Object.assign(device, { 
        x: cameraData.position?.x ?? 0, 
        y: cameraData.position?.y ?? 0 
      });
    }
  });

  selectedArchiveCameras.value.forEach(device => {
    const cameraData = props.selectedMap.cameras.find(c => c.camera_id === device.camera_id);
    
    if (cameraData) {
      Object.assign(device, { 
        x: cameraData.position?.x ?? 0, 
        y: cameraData.position?.y ?? 0 
      });
    }
  });

  console.log("✅ 已匹配的攝影機New:", selectedLiveCameras.value, selectedArchiveCameras.value);
}
function onImageLoad() {
  if (imgRef.value) {
    imgWidth.value = imgRef.value.clientWidth;
    imgHeight.value = imgRef.value.clientHeight;
    console.log("📸 Image loaded! Initial size:", imgWidth.value, imgHeight.value);

    initializeCameraPositions()
        }
    }
const stepDescription = computed(() => {
    switch (currentStep.value) {
      case 1: return '請上傳地圖圖片';
      case 2: return '請選擇需要加入地圖的攝影機';
      case 3: return '請拖拉攝影機到地圖上的適當位置';
      case 4: return '這是最終的地圖預覽';
      default: return '';
    }
  });


  watch(() => props.selectedMap, (newVal) => {
    if (!newVal || typeof newVal !== "object") return;

    console.log("🟢 新的地圖數據:", newVal);

    // ✅ 更新地圖基本資訊
    editedMap.value = { ...newVal };

    // ✅ 確保 `img` 為字串，並加上 Base64 前綴
    const imgData = newVal.img;
    if (typeof imgData === "string" && imgData.trim() !== "") {
        mapImage.value = imgData.startsWith("data:image")
            ? imgData
            : `data:image/png;base64,${imgData}`;
    } else {
        mapImage.value = null;
    }

    // ✅ 清空攝影機列表，確保不會累積舊數據
//     selectedLiveCameras.value = [];
//     selectedArchiveCameras.value = [];
//     console.log('攝影機資料',livedevices.value,archdevices.value)
//     // ✅ 避免 `cameras` 為空
//     // ✅ 清空攝影機列表，確保不會累積舊數據
// selectedLiveCameras.value = livedevices.value.filter(device => 
//   newVal.cameras.some(c => c.camera_id === device.camera_id && c.type.trim() === "live")
// );

// selectedArchiveCameras.value = archdevices.value.filter(device => 
//   newVal.cameras.some(c => c.camera_id === device.camera_id && c.type.trim() === "archive")
// );

// // ✅ 直接修改已選攝影機的 x, y 座標，不改變 Vue 追蹤的物件引用
// selectedLiveCameras.value.forEach(device => {
//   const cameraData = newVal.cameras.find(c => c.camera_id === device.camera_id);
  
//   if (cameraData) {
//     Object.assign(device, { 
//       x: cameraData.position.x ?? undefined, 
//       y: cameraData.position.y ?? undefined 
//     });
//   }
// });

// selectedArchiveCameras.value.forEach(device => {
//   const cameraData = newVal.cameras.find(c => c.camera_id === device.camera_id);
//   if (cameraData) {
//     Object.assign(device, { 
//       x: cameraData.position.x ?? undefined, 
//       y: cameraData.position.y ?? undefined 
//     });
//   }
// });

//     console.log("✅ 重新匹配攝影機：", selectedLiveCameras.value, selectedArchiveCameras.value);

}, { immediate: true });

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
  
  
const filteredLiveCameras = computed(() => {
    return livedevices.value.filter(camera =>
        camera.name.toLowerCase().includes(searchLive.value.toLowerCase())
    );
});


const filteredArchiveCameras = computed(() => {
    return archdevices.value.filter(camera =>
        camera.name.toLowerCase().includes(searchArchive.value.toLowerCase())
    );
});


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

function initializeCameraPositions() {
  const spacingX = 30;
  const spacingY = 30;
  const startX = 50;
  
console.log("w,h,",imgWidth.value,imgHeight.value)
selectedLiveCameras.value = selectedLiveCameras.value.map((camera, index) => ({
    ...camera,
    x: camera.x !== undefined ? camera.x * imgWidth.value : startX + (index % 5) * spacingX,
    y: camera.y !== undefined ? camera.y * imgHeight.value : 50 + Math.floor(index / 5) * spacingY,
}));

selectedArchiveCameras.value = selectedArchiveCameras.value.map((camera, index) => {
    console.log(`📸 檢查攝影機 ${index}：`, {
        camera_id: camera.camera_id,
        原始_x: camera.x,
        原始_y: camera.y,
        圖片寬度: imgWidth.value,
        圖片高度: imgHeight.value
    });

    return {
        ...camera,
        x: camera.x !== undefined ? camera.x * imgWidth.value : startX + (index % 5) * spacingX,
        y: camera.y !== undefined ? camera.y * imgHeight.value : 100 + Math.floor(index / 5) * spacingY,
    };
});

  console.log("✅ 初始位置：", selectedLiveCameras.value, selectedArchiveCameras.value);
}

// **監聽 step 進入拖拉攝影機時，初始化位置**
watch(currentStep, (newStep) => {
  if (newStep === 3) {
    console.log("🔄 進入步驟 3，準備初始化攝影機位置...");

    // 確保圖片寬高已載入，否則等待 `watch([imgWidth, imgHeight], ...)` 處理
    if (imgWidth.value > 0 && imgHeight.value > 0) {
    //   initializeCameraPositions();
    } else {
      console.log("⚠️ 圖片尚未載入，延遲初始化攝影機位置");
    }
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
// **儲存編輯資料**
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
        name: editedMap.value.name,
        background: mapImage.value, // Base64 圖片
        cameras: [...relativeLiveCameras, ...relativeArchiveCameras],// 合併 Live & Archive
        uuid:editedMap.value.uuid
    };

    console.log(" Sending data to backend:", saveData);

    try {
        const result = await store.editMaps(saveData);
        console.log("API Response:", result);

        if (result) {
            // ✅ 通知父組件重新抓取地圖列表
            emit("fetch-maps");

            // ✅ 關閉 modal
            
            closeModal()
            // ✅ 顯示成功通知
            successStore.show();
        }
    } catch (error) {
        console.error("儲存地圖失敗:", error);
    }

    resetForm();
}

function resetForm() {
  currentStep.value = 1;
  editedMap.value = {};
  mapImage.value = null;
  selectedLiveCameras.value = [];
  selectedArchiveCameras.value = [];
  searchLive.value = '';
  searchArchive.value = '';
  mapNameError.value = false;
  mapImageError.value = false;
  imgWidth.value = 0;
  imgHeight.value = 0;
}
// **關閉 Modal**
function closeModal() {
    resetForm()
    emit("update:isOpen", false);
}

// **步驟控制**
function nextStep() {
  if (currentStep.value === 1) {
    mapNameError.value = !editedMap.value.name.trim();
    mapImageError.value = !mapImage.value;

    if (mapNameError.value || mapImageError.value) return;
  }

  if (currentStep.value < 4) currentStep.value++;
}
function prevStep() { if (currentStep.value > 1) currentStep.value--; }

</script>
