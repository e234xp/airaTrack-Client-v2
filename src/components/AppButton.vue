<template>
  <div
    class="flex justify-center content-center cursor-pointer transition rounded"
    :class="{
      'bg-primary hover:bg-primary-hover': type === 'primary',
      'border-2 bg-gray-800 hover:bg-primary-hover': type === 'secondary',
      'hover:text-primary-hover': type === 'transparent',

      'border-b-4 border-primary': isActive && activeType === 'baseline',
      'text-primary': isActive && activeType !== 'baseline',
      'text-white': !isActive || activeType === 'baseline',

      'pointer-events-none border-0 bg-opacity-40': !isEnable,
    }"
  >
    <slot />
  </div>
</template>

<script setup>

defineProps({
  type: {
    type: String,
    default: 'primary',
    validator(value) {
      return ['primary', 'secondary', 'transparent'].includes(value);
    },
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  activeType: {
    type: String,
    default: 'color',
    validator(value) {
      return ['color', 'baseline'].includes(value);
    },
  },
  isEnable: {
    type: Boolean,
    default: true,
  },
});

</script>
