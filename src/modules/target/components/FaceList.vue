<template>
  <div class="content-start gap-3 list-container">
    <div
      v-for="face in faces"
      :key="face.data.id"
      class="select-none relative cursor-pointer w-full rounded border-4"
      :class="{ 'pointer-events-none': face.data.id === '' }"
      style="padding-top: 100%;"
      :style="{ 'border-color': getAlbumBorder(face.highest) }"
      @click="handleToggleFace(face)"
    >
      <template v-if="face.data.face_image">
        <img
          class="absolute top-0 left-0 w-full h-full object-cover"
          :class="[ getAlbumBorder(face.highest) === 'transparent' ? 'rounded' : '' ]"
          :src="spiderman.base64Image.getSrc(face.data.face_image)"
          alt=""
        >
        <div
          v-show="face.data.face_be_merged.length > 0"
          class="absolute top-0 left-0 w-full h-full flex justify-end items-end p-1"
        >
          <div
            class="relative h-6 flex justify-center items-center
                          text-sm font-bold rounded-2xl text-white"
            style="box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.4);"
            :style="{ backgroundColor: getAlbumBorder(face.highest) }"
            :class="[
              face.data.face_be_merged.length + 1 <= 99 ? 'w-8' : 'w-10',
              getAlbumBorder(face.highest) === 'transparent' ? '!bg-album-none' : ''
            ]"
            :id="`${type}-${face.data.id}`"
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
      </template>
      <!-- <template v-else>
        <div class="w-full"></div>
      </template> -->
    </div>
  </div>
</template>

<script setup>
import spiderman from '@/spiderman';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';
import useAlbums from '@/stores/albums';

const props = defineProps({
  faces: {
    type: Array,
    default() {
      return [];
    },
  },
  type: {
    type: String,
    default: '',
  },
});

const store = useStore();
const { selectedFace, confirmingFaces } = storeToRefs(store);
const {
  setSelectedFace, setConfirmingFaces, setConfirmedFace, getLiveFaceImage
} = store;

const albumsStore = useAlbums();
const { albums, albumColorMap } = storeToRefs(albumsStore);

function getAlbumBorder(highest) {
  if (!highest) return 'transparent';
  const { albumId } = highest;
  const idx = albums.value.findIndex((item) => item.albumId === albumId);
  if (idx < 0) return 'transparent';
  return  albumColorMap.value.get(idx) || 'transparent';
}

async function handleToggleFace(face) {
  console.log(face);
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

      ({ b64: image.b64, feature: image.feature } = await getLiveFaceImage(f.face_file));

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

<style lang="scss">
.list-container {
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 1fr);
}

</style>
