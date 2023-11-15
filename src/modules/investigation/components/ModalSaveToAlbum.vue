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

      <AppLabel :label="$t('Album')">
        <AppInput
          dark
          type="select"
          :options="options"
          v-model:modelInput="form.albumId"
        />
      </AppLabel>
      
    </template>

    <template #footer>
      <div class="flex justify-end text-2xl gap-4">
        <AppButton
          type="secondary"
          class="px-6 py-2"
          @click="setModal('')"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6 py-2"
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

const emit = defineEmits(['add']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const options = ref(null);
const form = ref({
  albumId: '',
});

const props = defineProps({
  list: {
    type: Array,
    default: []
  },
})

function handleAdd() {
  emit('add', form.value);
}

onMounted(async () => {
  options.value = props.list.reduce((obj, album) => {
    const tmp = obj;

    tmp[album.albumName] = album.albumId;
    return tmp;
  }, {});

  form.value.albumId = props.list[0].albumId;
});
</script>
