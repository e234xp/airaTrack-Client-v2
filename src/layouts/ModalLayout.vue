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
      class="border border-gray-300 bg-modal rounded-lg shadow-lg
      px-6 pt-4 pb-8"
      :class="{
        'w-176': size === 'xl'
      }"
    >
      <div class="flex justify-end">
        <AppSvgIcon
          name="icon-close"
          class="w-12 h-12"
          @click="$emit('close')"
        />
      </div>

      <h2 class="text-2xl mb-6 text-center">
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
  },
  size: {
    type: String,
    default: '1/2',
  },
});

defineEmits(['close']);
</script>
