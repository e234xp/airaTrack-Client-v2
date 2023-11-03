<template>
  <div class="w-80 bg-side-bar">
    <FullLayout>
      <template #header>
        <div
          class="mx-4 py-2 text-white text-xl"
        >
          {{ $t('Target') }}
        </div>

        <AppDivider />

        <AppButton
          type="secondary"
          class="mx-4 my-4"
          @click="onUpload"
        >
          {{ $t("Upload") }}
        </AppButton>

        <AppDivider />
      </template>

      <template #grow>
        <div class="m-4">
          <div
            v-if="selectedFace"
            class="aira-row-auto-1 gap-4"
          >
            <img
              class="w-full h-full"
              :src="spiderman.base64Image.getSrc(selectedFace?.data.face_image)"
              alt=""
            >

            <div class="relative w-full h-full">
              <img
                class="w-3/4 h-3/4 rounded border border-dashed"
                :style="{ borderColor: albumColor }"
                :src="spiderman.base64Image.getSrc(albumImage)"
                alt=""
                v-if="albumImage !== ''"
              >
              <div class="absolute left-0 bottom-0 w-full h-6" :style="{ backgroundColor: albumColor }"></div>
            </div>

          </div>

          <div
            v-else
            class="break-words text-base text-default"
          >
            {{ $t('SelectTargetPrompt') }}
          </div>
        </div>

        <AppDivider v-if="selectedFace" />

        <div class="m-4 aira-row-auto-1 gap-4">
          <div
            v-for="face in confirmingFaces"
            :key="face.data.id"
            class="select-none relative cursor-pointer"
            @click="handleToggleFace(face)"
          >
            <img
              class="w-full h-full"
              :src="spiderman.base64Image.getSrc(face?.data.face_image)"
              alt=""
            >
            <template
              v-if="face.data.id === confirmedFace?.data.id"
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

      <template #footer>
        <div class="mt-4">
          <AppButton
            type="primary"
            :is-enable="!!confirmedFace?.data.id"
            class="mx-4 mb-4"
            @click="setPage('adding-investgation')"
          >
            {{ $t("Investigation") }}
          </AppButton>
          <AppButton
            type="secondary"
            :is-enable="!!confirmedFace?.data.id"
            class="mx-4 mb-4"
            @click="setModal('save-to-album')"
            v-if="!isFromAlbum"
          >
            {{ $t("SaveToAlbum") }}
          </AppButton>
          <AppButton
            type="secondary"
            :is-enable="!!confirmedFace?.data.id"
            class="mx-4 mb-4"
            @click="setModal('move-to-other')"
            v-else
          >
            {{ $t("MovePhoto") }}
          </AppButton>
          <AppButton
            type="secondary"
            :is-enable="!!selectedFace?.data.id"
            class="mx-4 mb-4"
            @click="clearSelection()"
          >
            {{ $t("ClearSelection") }}
          </AppButton>
        </div>
      </template>
    </FullLayout>
  </div>

  <ModalSaveToAlbum
    :list="albums"
    @add="handleAddToAlbum"
  />

  <ModalMoveToAlbum
    :list="albums"
    :current="albumFrom"
    @move="handleMoveToAlbum"
  />
</template>

<script setup>
import { watch, computed } from 'vue';
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import successStore from '@/components/AppSuccess/success';

import useStore from '@/modules/target/stores/index';
import useAlbums from '@/stores/albums';

import ModalSaveToAlbum from '@/modules/target/components/ModalSaveToAlbum.vue';
import ModalMoveToAlbum from '@/modules/target/components/ModalMoveToAlbum.vue';

const store = useStore();
const { selectedFace, confirmingFaces, confirmedFace } = storeToRefs(store);
const {
  setPage, setSelectedFace, setConfirmingFaces, setConfirmedFace, setModal, addPhotoFeature
} = store;

const albumsStore = useAlbums();
const { albums, albumPhotoList, albumPhotoImage, albumColorMap } = storeToRefs(albumsStore);
const { getAlbumPhoto, deleteAlbumPhoto } = useAlbums();

const albumColor = computed({
  get: () => {
    if (selectedFace.value && selectedFace.value.highest && selectedFace.value.highest.albumId !== '') {
      const idx = albums.value.findIndex((item) => item.albumId === selectedFace.value.highest.albumId);
      if (idx < 0) return '';
      return albumColorMap.value.get(idx) || '';
    }
    return '';
  }
})

const albumImage = computed({
  get: () => {
    if (selectedFace.value && selectedFace.value.highest && selectedFace.value.highest.albumId !== '') {
      const key = `${selectedFace.value.highest.key}.png`;
      const idx = albumPhotoImage.value.findIndex((image) => image.photoId === key);
      if (idx < 0) return '';
      return albumPhotoImage.value[idx].base64Image;
    }
    return '';
  }
})

const albumFrom = computed({
  get: () => {
    if (selectedFace.value && selectedFace.value.photoId) {
      let id = '';
      albumPhotoList.value.forEach((value, key) => {
        if (value.indexOf(selectedFace.value.photoId) >= 0) id = key;
      })
      return id;
    }
    return ''
  }
})

const isFromAlbum = computed({
  get: () => {
    return selectedFace.value && selectedFace.value.photoId;
  }
})

watch(selectedFace, async () => {
  if (selectedFace.value && selectedFace.value.highest && selectedFace.value.highest.albumId !== '') {
    const key = `${selectedFace.value.highest.key}.png`;
    const idx = albumPhotoImage.value.findIndex((image) => image.photoId === key);
    if (idx < 0) {
      await getAlbumPhoto([key]);
    }
  }
})

async function handleToggleFace(face) {
  if (confirmedFace.value?.data?.id === face.data.id) {
    setConfirmedFace(null);
  } else {
    setConfirmedFace(face);
  }
}

function clearSelection() {
  setSelectedFace(null);
  setConfirmingFaces([]);
  setConfirmedFace(null);
}

async function handleAddToAlbum(form) {
  const { albumId } = form;
  const { data: { id, face_image: faceImage, feature } } = confirmedFace.value;
  const data = {
    albumId, id, face_image: faceImage, feature,
  };
  await addPhotoFeature(data);
  setModal('');
  successStore.show();
}

async function handleMoveToAlbum(form) {
  const { albumId } = form;
  const { data: { id, face_image: faceImage, feature } } = selectedFace.value;
  const addData = { albumId, id, face_image: faceImage, feature };
  await addPhotoFeature(addData);

  const deleteData = {
    albumId: albumFrom.value,
    albumData: [selectedFace.value.photoId],
  };

  await deleteAlbumPhoto(deleteData);
  setModal('');
  successStore.show();
}

function onUpload() {
  setModal('upload');
}
</script>
