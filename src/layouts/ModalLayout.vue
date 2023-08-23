<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 backdrop-filter backdrop-blur-lg"
  />

  <!-- Modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center z-50"
  >
    <div
      class="bg-white py-6 px-8 rounded-lg shadow-lg"
      :class="{
        'w-176': size === 'xl'
      }"
    >
      <h2 class="text-4xl font-semibold mb-6">
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
</script>
