<template>
  <div class="aira-row-auto-1 content-start gap-4">
    <div
      v-for="face in faces"
      :key="face.data.id"
      class="select-none relative cursor-pointer"
      @click="handleToggleFace(face)"
    >
      <img
        class="w-40"
        :src="spiderman.base64Image.getSrc(face.data.face_image)"
        alt=""
      >
      <div
        v-show="face.data.face_be_merged.length > 0"
        class="absolute top-0 left-0 w-full h-full flex justify-end items-end"
      >
        <div
          class="w-8 h-6 flex justify-center items-center
                        text-sm font-bold
                        bg-white text-gray-600"
        >
          <template v-if="face.data.face_be_merged.length + 1<=99">
            {{ face.data.face_be_merged.length + 1 }}
          </template>
          <template v-else>
            99+
          </template>
        </div>
      </div>
      <template
        v-if="face.data.id === selectedFace?.data.id"
      >
        <div
          class="absolute inset-0 bg-gray-900 opacity-40"
        />
        <div
          class="absolute top-0 left-0 w-full h-full
                       flex items-center justify-center"
        >
          <AppSvgIcon
            name="icon-check"
            class="text-white w-16 h-16"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import spiderman from '@/spiderman';
import { storeToRefs } from 'pinia';

import useUserStore from '@/stores/user';
import useStore from '@/modules/target/stores/index';

defineProps({
  faces: {
    type: Array,
    default() {
      return [];
    },
  },

});

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { selectedFace, confirmingFaces } = storeToRefs(store);
const {
  setSelectedFace, setConfirmingFaces, setConfirmedFace,
} = store;

async function handleToggleFace(face) {
  if (selectedFace.value?.data?.id === face.data.id) {
    setSelectedFace(null);
    setConfirmingFaces([]);
    setConfirmedFace(null);
  } else {
    setSelectedFace(face);
    setConfirmingFaces([]);
    setConfirmingFacesAll(face);
    setConfirmedFace(face);
  }
}

// return 出一個陣列
async function setConfirmingFacesAll(face) {
  setConfirmingFaces([face]);
  const myId = face.data.id;
  const batchSize = 5; // 设置批处理大小
  const faceBatches = chunkArray(face.data.face_be_merged, batchSize);

  let currentBatchIndex = 0;
  while (currentBatchIndex < faceBatches.length && selectedFace.value.data.id === myId) {
    let tmp = [];
    const faceBatch = faceBatches[currentBatchIndex];

    // eslint-disable-next-line no-await-in-loop
    await Promise.allSettled(faceBatch.map(async (f) => {
      const image = {};
      ({ b64: image.b64, feature: image.feature } = await spiderman.apiService({
        url: `${spiderman.system.apiBaseUrl}/airaTracker/livefaceimage`,
        method: 'post',
        headers: { sessionId: sessionId.value },
        data: {
          face_file: f.face_file,
        },
      }));

      tmp = [...tmp, {
        camera_id: face.camera_id,
        timestamp: face.timestamp,
        data: {
          id: f.id,
          face_file: f.face_file,
          face_image: image.b64,
          feature: image.feature,
        },
      }];
      return { id: f.id };
    }));

    if (selectedFace.value?.data.id === myId) {
      setConfirmingFaces([...confirmingFaces.value, ...tmp]);
    }

    currentBatchIndex += 1;
  }
}

// 辅助函数，将数组分成大小相等的块
function chunkArray(array, chunkSize) {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
</script>
