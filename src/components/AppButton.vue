<template>
  <div
    class="flex justify-center items-center cursor-pointer transition text-base py-2"
    :class="[{
      'bg-ctrl-primary hover:bg-ctrl-primary-hover border border-white rounded leading-4': type === 'primary',
      'bg-ctrl-secondary hover:bg-ctrl-secondary-hover border border-white rounded leading-4': type === 'secondary',
      'bg-ctrl-danger hover:bg-ctrl-danger-hover border border-white rounded leading-4': type === 'danger',
      'hover:text-primary-hover': type === 'transparent',
      'opacity-30': type === 'transparent' && !isEnable,

      'text-default font-normal': !isActive,
      'relative text-white hover:text-white after:block after:w-full after:border-2 after:border-solid after:border-primary after:absolute after:-bottom-1': isActive && activeType === 'baseline',
      'text-primary': isActive && activeType !== 'baseline',

      'pointer-events-none bg-opacity-30 border-opacity-30': !isEnable
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
        return props.isEnable ? 'text-white shadow-btn' : 'text-gray-600';
      case 'primary':
      case 'danger':
      return props.isEnable ? 'text-white shadow-btn' : 'text-gray-400';
      default:
        return '';
    }
  }
})
</script>
