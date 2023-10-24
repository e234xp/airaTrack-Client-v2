<template>
  <ModalLayout
    :is-open="modal === 'save-to-album'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('SaveToAlbum') }}
    </template>

    <template #default>
      <AppInput
        dark
        type="select"
        :options="options"
        class="mb-6"
        v-model:modelInput="form.albumId"
      />
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
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
import useStore from '@/modules/target/stores/index';

const emit = defineEmits(['add']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal, getAlbum } = store;

const options = ref(null);
const form = ref({
  albumId: '',
});
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

function handleAdd() {
  emit('add', form.value);
}
</script>
