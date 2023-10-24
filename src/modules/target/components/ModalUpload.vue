<template>
  <ModalLayout :is-open="modal === 'upload'" @close="onClose">
    <template #header>
      {{ $t('UploadFile') }}
    </template>

    <template #default>
      <div class="flex justify-center cursor-pointer w-full h-80" @click="onUploadImage">
        <AppSvgIcon
          name="icon-image"
          class="text-gray-600"
          v-if="image === ''"
        />
        <input type="file" ref="file" accept="image/*" @change="fileOnChange" style="display: none;" />
        <img :src="image">
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="onClose"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          :disabled="image === ''"
          @click="handleUpload"
        >
          {{ $t('Upload') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';
import successStore from '@/components/AppSuccess/success';

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal, uploadPhoto } = store;

const image = ref('');
const file = ref(null);

function onClose() {
  image.value = '';
  setModal('');
}

function onUploadImage() {
  file.value.click();
}

async function handleUpload() {
  const result = await uploadPhoto(image.value);
  if (result) {
    successStore.show();
    onClose();
  }
}

function fileOnChange(e) {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file, 'UTF-8');
  reader.onload = async (readerEvent) => {
    image.value = readerEvent.target.result;
    const img = document.createElement('img');
    img.src = readerEvent.target.result;
  };
}
</script>