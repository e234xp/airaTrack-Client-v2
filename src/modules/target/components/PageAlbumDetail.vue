<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="mx-4 my-3">
          <div class="flex justify-between">
            <div class="mb-4 flex justify-start">
              <AppButton
                type="secondary"
                class="w-40 mr-6 py-2"
                @click="setPage('album-list')"
              >
                {{ $t('Return') }}
              </AppButton>
            </div>

            <div class="mb-4 flex justify-end">
              <template v-if="!isEditMode">
                <AppButton
                  type="secondary"
                  class="w-40 ml-6 py-2"
                  @click="toggleEditMode"
                >
                  {{ $t('Edit') }}
                </AppButton>
              </template>
              <template v-else>
                <AppButton
                  type="secondary"
                  class="w-40 ml-6 py-2"
                  @click="toggleEditMode"
                >
                  {{ $t('Cancel') }}
                </AppButton>
                <AppButton
                  type="primary"
                  class="w-40 ml-6 py-2"
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
            class="aira-row-auto-1 content-start gap-4"
          >
            <div
              v-for="face in faces"
              :key="face.data.id"
              class="select-none relative cursor-pointer"
            >
              <img
                class="w-40"
                :src="spiderman.base64Image.getSrc(face.data.face_image)"
                alt=""
                @click="selectFace(face)"
              >
              <AppCheckBox
                :checked="findIndex(face) !== -1"
                class="absolute bottom-1 right-1"
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
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import FaceList from '@/modules/target/components/FaceList.vue';
import useStore from '@/modules/target/stores/index';

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { selectedAlbum } = storeToRefs(store);
const { setPage } = store;

const faces = ref([]);
onMounted((async () => {
  const { fileData: photoIds } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albumdata`,
    method: 'get',
    headers: { sessionId: sessionId.value },
    params: {
      albumId: selectedAlbum.value.albumId,
    },
  });

  const photos = {};
  await Promise.allSettled(photoIds.map(async (photoId) => {
    const { base64Image, faceFeature } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photo`,
      method: 'get',
      headers: { sessionId: sessionId.value },
      params: {
        photoName: photoId,
      },
    });

    photos[photoId] = {
      base64Image, faceFeature,
    };

    return { result: 'ok' };
  }));

  faces.value = reconstructToFaces(photos);
}));

function reconstructToFaces(photos) {
  const photosArray = Object.entries(photos);

  return photosArray.map(([photoId, { base64Image, faceFeature }]) => ({
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
    },
  }));
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
    albumId: selectedAlbum.value.albumId,
    albumData: selectedFaces.value.map(({ photoId }) => photoId),
  };

  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photo`,
    method: 'delete',
    headers: { sessionId: sessionId.value },
    data,
  });

  faces.value = faces.value.filter((face) => !data.albumData.includes(face.photoId));
  toggleEditMode();
}
</script>
