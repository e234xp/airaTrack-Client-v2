<template>
  <ProgressBarLayout>
    <FullLayout style="width: max(83%, calc(100% - 20rem))">
      <template #grow>
        <div class="m-4">
          <div class="flex justify-between">
            <div class="mb-2 flex justify-start items-center gap-2">
              <AppButton
                type="secondary"
                class="!p-0 w-8 h-8 mr-2"
                @click="setPage('album-list')"
              >
                <AppSvgIcon name="icon-chevron-left" class="text-white w-4 h-4" />
              </AppButton>
              <AppSvgIcon name="icon-album" class="w-6 h-6" :color="albumColor" />
              <div class="text-xl" :style="{ color: albumColor }">{{ albumName }}</div>
            </div>

            <div class="mb-2 flex justify-end items-center gap-4">
              <template v-if="!isEditMode">
                <AppButton
                  type="secondary"
                  class="w-40"
                  @click="toggleEditMode"
                >
                  {{ $t('Edit') }}
                </AppButton>
              </template>
              <template v-else>
                <AppButton
                  type="secondary"
                  class="w-40"
                  @click="toggleEditMode"
                >
                  {{ $t('Cancel') }}
                </AppButton>
                <AppButton
                  type="primary"
                  class="w-40"
                  :is-enable="selectedFaces.length>0"
                  @click="handleDelete"
                >
                  {{ $t('Delete') }}
                </AppButton>
              </template>
            </div>
          </div>

          <FaceList
            v-if="!isEditMode"
            :faces="faces"
          />

          <div
            v-else
            class="content-start gap-3 list-container"
          >
            <div
              v-for="face in faces"
              :key="face.data.id"
              class="select-none relative cursor-pointer w-full min-h-24 border-4 border-transparent"
              style="padding-top: 100%;"
            >
              <img
                class="absolute top-0 left-0 w-full h-full object-cover rounded"
                :src="spiderman.base64Image.getSrc(face.data.face_image)"
                alt=""
                @click="selectFace(face)"
              >
              <AppCheckBox
                :checked="findIndex(face) !== -1"
                class="absolute bottom-1 -right-3 !w-8"
              />
            </div>
          </div>
        </div>
      </template>
    </FullLayout>

    <SideBar />
  </ProgressBarLayout>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';
import useStore from '@/modules/target/stores/index';
import useAlbums from '@/stores/albums';

const albumsStore = useAlbums();
const { albums, albumPhotoList, albumColorMap, albumPhotoImage } = storeToRefs(albumsStore);
const { getAlbumPhoto, deleteAlbumPhoto } = useAlbums();

const store = useStore();
const { selectedAlbumDetail } = storeToRefs(store);
const { setPage } = store;

const albumName = computed({
  get: () => { 
    const temp = albums.value.find((item) => item.albumId === selectedAlbumDetail.value.albumId);
    return temp.albumName || '';
  }
})

const albumColor = computed({
  get: () => {
    const idx = albums.value.findIndex((item) => item.albumId === selectedAlbumDetail.value.albumId); 
    return albumColorMap.value.get(idx) || '#FFF';
  }
})

const faces = computed({
  get: () => {
    const list = albumPhotoList.value.get(selectedAlbumDetail.value.albumId) || [];
    const filter = list.filter((id) => albumPhotoImage.value.findIndex((img) => img.photoId === id) >= 0);
    return filter.map((id) => {
      const image = albumPhotoImage.value.find((img) => img.photoId === id);
      const { base64Image, faceFeature } = image;
      return reconstruct(base64Image, faceFeature, id);
    })
  }
})

// const faces = ref([]);
onMounted((async () => {
  const list = albumPhotoList.value.get(selectedAlbumDetail.value.albumId) || [];
  const filter = list.filter((id) => albumPhotoImage.value.findIndex((img) => img.photoId === id) < 0);
  const result = [];
  let temp = [];
  let count = 0;
  filter.forEach((id) => {
    temp.push(id);
    count++;
    if (count === 4) {
      result.push(temp.map((d) => d));
      count = 0;
      temp.length = 0;
      temp = [];
    }
  })
  if (temp.length !== 0) result.push(temp.map((d) => d));

  await Promise.allSettled(result.map(async (photoList) => {
    await getAlbumPhoto(photoList);
  }));
}));

function reconstruct(base64Image, faceFeature, photoId) {
  return {
    camera_id: '',
    photoId,
    timestamp: Date.now(),
    data: {
      face_image: base64Image,
      feature: faceFeature,
      id: spiderman.uuid(),
      bFeature: null,
      face_be_merged: [],
      face_file: '',
    }
  }
}

const selectedFaces = ref([]);
function selectFace(face) {
  const index = findIndex(face);
  if (index === -1) {
    selectedFaces.value.push(face);
    return;
  }
  selectedFaces.value.splice(index, 1);
}

function findIndex(face) {
  return selectedFaces.value
    .findIndex((selectedFace) => selectedFace.data.id === face.data.id);
}

const isEditMode = ref(false);
function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
  selectedFaces.value = [];
}

async function handleDelete() {
  const data = {
    albumId: selectedAlbumDetail.value.albumId,
    albumData: selectedFaces.value.map(({ photoId }) => photoId),
  };

  await deleteAlbumPhoto(data);

  // faces.value = faces.value.filter((face) => !data.albumData.includes(face.photoId));
  toggleEditMode();
}
</script>

<style>
.list-container {
  display: grid;
  grid-auto-flow: dense;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 1fr);
}
</style>