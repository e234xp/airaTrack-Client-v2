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
          class="mb-6"
          v-model:modelInput="form.albumId"
        />
      </AppLabel>
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
const { setModal } = store;

const props = defineProps({
  list: {
    type: Array,
    default: []
  },
})

const options = ref(null);
const form = ref({
  albumId: ''
});

onMounted(async () => {
  options.value = props.list.reduce((obj, album) => {
    const tmp = obj;

    tmp[album.albumName] = album.albumId;
    return tmp;
  }, {});

  form.value.albumId = props.list[0].albumId;
});

function handleAdd() {
  emit('add', form.value);
}
</script>
