<template>
  <ModalLayout
    :is-open="modal === 'edit-album'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('EditAlbum') }}
    </template>

    <template #description>
      {{ $t('EditAlbumDialog') }}
    </template>

    <template #default>
      <AppLabel :label="$t('AlbumName')">
        <AppInput
          dark
          v-model:modelInput="name"
          :placeholder="$t('AlbumName')"
          class="mb-6 text-base"
        />
      </AppLabel>

      <AppLabel :label="$t('Description')">
        <AppInput
          dark
          v-model:modelInput="description"
          :placeholder="$t('Description')"
          class="mb-6 text-base"
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
          @click="handleEdit"
        >
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/target/stores/index';

const props = defineProps({
  modalName: {
    type: String,
    default: ''
  },
  modalDescription: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['edit', 'update:modalName', 'update:modalDescription']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const name = computed({
  get: () => props.modalName,
  set: (val) => emit('update:modalName', val)
})

const description = computed({
  get: () => props.modalDescription,
  set: (val) => emit('update:modalDescription', val)
})

function handleEdit() {
  emit('edit');
}
</script>
