<template>
  <div class="text-base">
    <label
      class="block text-xl font"
      :class="`text-${textColor}`"
    >
      {{ label }}
    </label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: 'label',
  },
  background: {
    type: String,
    default: 'secondary',
  },
  textColor: {
    type: String,
    default: 'white',
  },
});
</script>
