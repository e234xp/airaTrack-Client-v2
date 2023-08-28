<template>
  <ModalLayout
    size="xl"
    :is-open="modal === 'save-to-album'"
  >
    <template #header>
      {{ $t('SaveToAlbum') }}
    </template>

    <template #default>
      <AppInput
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

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

import useStore from '@/modules/target/stores/index';

const emit = defineEmits(['add']);

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const options = ref(null);
const form = ref({
  albumId: '',
});
onMounted(async () => {
  const albums = (await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
    method: 'get',
    headers: { sessionId: sessionId.value },
  }))
    .data
    .filter(({ albumName }) => albumName !== 'Upload Photo');
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
