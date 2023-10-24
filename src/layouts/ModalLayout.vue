<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 backdrop-filter backdrop-blur-lg"
  />

  <!-- Modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50 text-white"
  >
    <div
      class="w-176 border border-gray-400 bg-modal rounded-lg shadow-lg p-4"
    >
      <div class="flex justify-end">
        <AppSvgIcon
          name="icon-close"
          class="w-8 h-8 cursor-pointer"
          @click="$emit('close')"
        />
      </div>

      <h2 class="text-2xl mb-4 text-center">
        <slot name="header" />
      </h2>

      <div>
        <slot />
      </div>

      <div class="mt-4">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { AppSvgIcon } from '../components/app';

defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  }
});

defineEmits(['close']);
</script>
