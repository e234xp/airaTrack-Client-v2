<template>
  <div class="aira-row-auto-2 gap-8">
    <div
      v-for="face in faces"
      :key="face.data.id"
      class="select-none relative cursor-pointer border-4"
      @click="handleToggleFace(face)"
    >
      <img
        class="w-full h-full"
        :src="spiderman.base64Image.getSrc(face.data.face_image)"
        alt=""
      >
      <div class="absolute top-0 left-0 w-full h-full flex justify-end items-end">
        <div
          class="w-8 h-8 rounded flex justify-center items-center
                        text-lg font-bold
                        bg-white text-gray-800"
        >
          {{ face.data.face_be_merged.length + 1 }}
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
let currentId;
async function setConfirmingFacesAll(face) {
  currentId = face.data.id;
  setConfirmingFaces([face]);

  let tmp = [];
  await Promise.allSettled(face.data.face_be_merged.map(async (f) => {
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

  setConfirmingFaces([...confirmingFaces.value, ...tmp]);
}
</script>
