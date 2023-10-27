<template>
  <div class="w-80 bg-side-bar">
    <FullLayout>
      <template #header>
        <div
          class="mx-5 py-2 text-white text-xl"
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
            <div
              class="cursor-pointer"
            >
              <img
                class="w-full h-full"
                :src="spiderman.base64Image.getSrc(selectedFace?.data.face_image)"
                alt=""
              >
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
        <div class="my-4">
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
          >
            {{ $t("SaveToAlbum") }}
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
    @add="handleAddToAlbum"
  />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

import spiderman from '@/spiderman';
import successStore from '@/components/AppSuccess/success';

import useStore from '@/modules/target/stores/index';
import ModalSaveToAlbum from '@/modules/target/components/ModalSaveToAlbum.vue';

const router = useRouter();

const store = useStore();
const { selectedFace, confirmingFaces, confirmedFace } = storeToRefs(store);
const {
  setPage, setSelectedFace, setConfirmingFaces, setConfirmedFace, setModal, addPhotoFeature
} = store;

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

function onUpload() {
  setModal('upload');
}
</script>
