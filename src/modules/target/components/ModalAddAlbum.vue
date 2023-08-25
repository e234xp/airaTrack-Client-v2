<template>
  <ModalLayout
    size="xl"
    :is-open="modal === 'add-album'"
  >
    <template #header>
      {{ $t('Add') }}
    </template>

    <template #default>
      <AppInput
        v-model:modelInput="form.albumName"
        :placeholder="$t('AlbumName')"
        class="mb-8 text-2xl"
        @submit="handleAdd"
        :has-submitted="hasSubmitted"
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
