<template>
  <ModalLayout :is-open="modal === 'delete'" @close="setModal('')">
    <template #header>
      {{ $t('DeletTaskTitle') }}
    </template>

    <template #description>
      {{ $t('DeletTaskDialog') }}
    </template>

    <template #default>
      <div class="flex gap-2">
        <img
          class="w-48 h-48 mr-2 object-cover"
          v-lazy="spiderman.base64Image.getSrc(image)"
          alt=""
        >
        <div>
          <AppLabel :label="$t('TaskName')">
            {{ name }}
          </AppLabel>
          <AppLabel :label="$t('RunningTime')">
            {{ time }}
          </AppLabel>
        </div>
      </div>
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
          type="danger"
          class="px-6"
          @click="$emit('delete')"
        >
          {{ $t('Delete') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import spiderman from '@/spiderman';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const props = defineProps({
  image: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  time: {
    type: String,
    default: '',
  },
})

defineEmits(['delete']);
</script>

<style scoped>

</style>
