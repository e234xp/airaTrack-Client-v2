<template>
  <ModalLayout
    :is-open="modal === 'move-to-other'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('MovePhoto') }}
    </template>

    <template #description>
      {{ $t('MoveToAlbumDialog') }}
    </template>

    <template #default>
      <div class="mb-2 text-xl">
        {{ $t('CurrentAlbum') }} : {{ currentAlbumName }}
      </div>
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
          @click="handleMove"
        >
          {{ $t('Move') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/target/stores/index';

const emit = defineEmits(['move']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const props = defineProps({
  list: {
    type: Array,
    default: []
  },
  current: {
    type: String,
    default: ''
  }
})

const options = ref(null);
const form = ref({
  albumId: ''
});

const currentAlbumName = computed({
  get: () => {
    if (props.current === '') return '';
    return props.list.find((item) => item.albumId === props.current).albumName || '';
  }
})

watch(() => props.current, () => {
  const filter = props.list.filter((item) => item.albumId !== props.current);
  options.value = filter.reduce((obj, album) => {
    const tmp = obj;

    tmp[album.albumName] = album.albumId;
    return tmp;
  }, {});

  if (filter.length !== 0) form.value.albumId = filter[0].albumId;
})

function handleMove() {
  emit('move', form.value);
}
</script>
