<template>
  <div class="w-96 bg-gray-600">
    <FullLayout>
      <template #header>
        <div
          class="mx-6 my-4 text-white text-left text-2xl font-bold"
        >
          {{ $t('Target') }}
        </div>

        <AppButton
          type="secondary"
          class="mx-6 mb-8 py-3"
        >
          {{ $t("Upload") }}
        </AppButton>

        <div class="mx-6 mb-8">
          <div
            v-if="selectedFace"
            class="aira-row-auto-1 gap-4"
          >
            <div
              class="cursor-pointer border-4"
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
            class="break-words text-xl text-gray-300"
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
              class="select-none relative cursor-pointer border-4"
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
</template>

<script setup>
import { storeToRefs } from 'pinia';
import spiderman from '@/spiderman';

import useStore from '@/modules/target/stores/index';

const store = useStore();
const { setPage } = store;
const { selectedFace, confirmingFaces, confirmedFace } = storeToRefs(store);
const { setSelectedFace, setConfirmingFaces, setConfirmedFace } = store;

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
</script>
