<template>
  <ModalLayout
    size="2/6"
    :is-open="isOpen"
  >
    <template #header>
      {{ header }}
    </template>

    <template #default>
      <div class="mb-10 text-2xl">
        {{ body }}
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end text-2xl">
        <AppButton
          v-for="button in buttons"
          :key="button"
          :type="button.type"
          class="ml-6 px-6 py-2"
          @click="$emit(button.emit)"
        >
          {{ button.text }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import ModalLayout from '@/layouts/ModalLayout.vue';

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  header: {
    type: String,
    default: '',
  },
  body: {
    type: String,
    default: '',
  },
  buttons: {
    type: Array,
    default() {
      return [];
    },
  },
});

defineEmits(['close']);
</script>
