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
      class="relative w-224 border border-modal bg-modal rounded-lg shadow-cus p-10"
    >
      <div class="absolute right-4 top-4">
        <AppSvgIcon
          name="icon-close"
          class="w-6 h-6 cursor-pointer"
          @click="$emit('close')"
        />
      </div>

      <h2 class="text-3xl text-primary">
        <slot name="header" />
      </h2>

      <div class="flex">
        <div class="relative w-1/2 border-r-2 border-gray-600 mr-4 pt-4">
          <div class="h-60 min-h-full w-full">
            <slot name="description" />
          </div>
        </div>

        <div class="w-1/2 flex flex-col">

          <div class="pb-16">
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

defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  }
});

defineEmits(['close']);
</script>
