<template>
  <div
    class="flex justify-center items-center cursor-pointer transition text-sm py-2"
    :class="[{
      'bg-primary hover:bg-primary-hover hover:border-primary-hover border border-transparent rounded leading-4': type === 'primary',
      'bg-secondary hover:bg-primary-hover hover:border-primary-hover border rounded leading-4': type === 'secondary',
      'bg-danger hover:bg-danger-hover hover:border-danger-hover border border-transparent rounded': type === 'danger',
      'hover:text-primary-hover': type === 'transparent',

      'text-default font-normal': !isActive,
      'relative text-white hover:text-white after:block after:w-full after:border-2 after:border-solid after:border-primary after:absolute after:-bottom-1': isActive && activeType === 'baseline',
      'text-primary hover:text-primary': isActive && activeType !== 'baseline',

      'pointer-events-none border bg-opacity-40': !isEnable
    }, classParse]"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'primary',
    validator(value) {
      return ['primary', 'secondary', 'transparent', 'danger'].includes(value);
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

const classParse = computed({
  get: () => {
    switch (props.type) {
      case 'secondary':
        return props.isEnable ? 'border-gray-500 text-white shadow-md' : 'border-transparent text-gray-600';
      case 'primary':
      case 'danger':
      return props.isEnable ? 'text-white shadow-md' : 'text-gray-400';
      default:
        return '';
    }
  }
})
</script>
