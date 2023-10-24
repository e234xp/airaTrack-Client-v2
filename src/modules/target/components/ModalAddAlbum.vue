<template>
  <ModalLayout
    :is-open="modal === 'add-album'"
    @close="setModal('')"
  >
    <template #header>
      {{ $t('Add') }}
    </template>

    <template #default>
      <AppInput
        dark
        v-model:modelInput="form.albumName"
        :placeholder="$t('AlbumName')"
        class="mb-6 text-base"
        @submit="handleAdd"
        :has-submitted="hasSubmitted"
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
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import useSubmit from '@/composable/useSubmit';

import useStore from '@/modules/target/stores/index';

const emit = defineEmits(['add']);

const { hasSubmitted, generateSubmit } = useSubmit();

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const form = ref({
  albumName: '',
});

function clearForm() {
  form.value = {
    albumName: '',
  };
}

const handleAdd = generateSubmit(async () => {
  await emit('add', form.value);
  clearForm();
});
</script>
