<template>
  <div
    class="flex justify-center content-center cursor-pointer transition rounded"
    :class="{
      'bg-primary hover:bg-primary-hover text-white': type === 'primary',
      'bg-secondary hover:bg-primary-hover text-white': type === 'secondary',
      'hover:text-primary-hover': type === 'transparent',

      'text-default': !isActive,
      'border-b-4 border-primary text-white': isActive && activeType === 'baseline',
      'text-primary': isActive && activeType !== 'baseline',

      'pointer-events-none border-0 bg-opacity-40': !isEnable,
      'border-0': !isEnable && type === 'secondary',
      'border-2 border-gray-500': isEnable && type === 'secondary',
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
