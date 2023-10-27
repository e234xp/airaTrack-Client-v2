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
      class="relative w-224 border border-general bg-panel rounded-lg shadow-lg p-10" style="background-color: rgba(40, 40, 40, 1);"
    >
      <div class="absolute right-4 top-4">
        <AppSvgIcon
          name="icon-close"
          class="w-6 h-6 cursor-pointer"
          @click="$emit('close')"
        />
      </div>

      <h2 class="text-3xl text-btn-primary">
        <slot name="header" />
      </h2>

      <div class="flex">
        <div class="w-1/2 border-r-2 border-gray-600 mr-4">
          <div class="h-60 min-h-full w-full">
            <slot name="description" />
          </div>
        </div>

        <div class="w-1/2 flex flex-col">

          <div class="pb-20">
            <slot />
          </div>

          <div class="mt-auto">
            <slot name="footer" />
          </div>
        </div>
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
