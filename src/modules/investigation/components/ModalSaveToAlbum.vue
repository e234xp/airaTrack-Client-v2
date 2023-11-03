<template>
  <ModalLayout
    :is-open="modal === 'save-to-album'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('SaveToAlbum') }}
    </template>

    <template #description>
      {{ $t('SaveToAlbumDialog') }}
    </template>

    <template #default>
      <AppInput
        dark
        type="select"
        :options="options"
        v-model:modelInput="form.albumId"
      />
    </template>

    <template #footer>
      <div class="flex justify-end text-2xl">
        <AppButton
          type="secondary"
          class="ml-6 px-6 py-2"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="ml-6 px-6 py-2"
          @click="handleAdd"
        >
          {{ $t('Add') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/investigation/stores/index';
import useTargetStore from '@/modules/target/stores/index';

const emit = defineEmits(['add']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const targetStore = useTargetStore();
const { getAlbum } = targetStore;

const options = ref(null);
const form = ref({
  albumId: '',
});

function handleAdd() {
  emit('add', form.value);
}

onMounted(async () => {
  const { data } = await getAlbum();

  const albums = data.filter(({ albumName }) => albumName !== 'Upload Photo');
  options.value = albums.reduce((obj, album) => {
    const tmp = obj;

    tmp[album.albumName] = album.albumId;
    return tmp;
  }, {});

  const defaultAlbum = albums.find((album) => album.albumName === 'Default album');

  form.value.albumId = defaultAlbum.albumId;
});
</script>
