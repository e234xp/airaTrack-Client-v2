<template>
  <div class="w-96 bg-side-bar/40">
    <FullLayout>
      <template #header>
        <div
          class="mx-6 my-6 text-white text-left text-2xl"
        >
          {{ $t('Target') }}
        </div>

        <AppDivider />

        <AppButton
          type="secondary"
          class="mx-6 my-6 py-3 text-xl"
        >
          {{ $t("Upload") }}
        </AppButton>

        <AppDivider />

        <div class="mx-6 my-8">
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
            class="leading-10 break-words text-2xl text-default"
          >
            {{ $t('SelectTargetPrompt') }}
          </div>
        </div>
      </template>

      <template #grow>
        <div class="mx-6 mb-8">
          <div
            class="aira-row-auto-1 gap-4"
          >
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
        </div>
      </template>

      <template #footer>
        <div class="my-4">
          <AppButton
            type="primary"
            :is-enable="!!confirmedFace?.data.id"
            class="mx-6 mb-4 py-3"
            @click="setPage('adding-investgation')"
          >
            {{ $t("Investigation") }}
          </AppButton>
          <AppButton
            type="secondary"
            :is-enable="!!confirmedFace?.data.id"
            class="mx-6 mb-4 py-3"
            @click="setModal('save-to-album')"
          >
            {{ $t("SaveToAlbum") }}
          </AppButton>
          <AppButton
            type="secondary"
            :is-enable="!!selectedFace?.data.id"
            class="mx-6 mb-4 py-3"
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

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';
import successStore from '@/stores/success';

import useStore from '@/modules/target/stores/index';
import ModalSaveToAlbum from '@/modules/target/components/ModalSaveToAlbum.vue';

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { selectedFace, confirmingFaces, confirmedFace } = storeToRefs(store);
const {
  setPage, setSelectedFace, setConfirmingFaces, setConfirmedFace, setModal,
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
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photoFeature`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data,
  });
  setModal('');
  successStore.show();
}
</script>
