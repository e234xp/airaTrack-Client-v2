<template>
  <div v-if="isOpen" class="fixed inset-0 z-40 backdrop-filter backdrop-blur-lg" />

  <!-- Modal -->
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 text-white">
    <div
      class="relative border border-modal bg-modal rounded-lg shadow-cus p-10"
      :class="modalSizeClass"
      :style="{ width: width || '', height: height || '' }"
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
        <div class="relative w-3/12 border-r-2 border-gray-600 mr-4 pt-4 pr-4">
          <div class="h-60 min-h-full w-full">
            <slot name="description" />
          </div>
        </div>

        <div class="w-9/12 flex flex-col">
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
import { computed } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: '', // 預設不改變大小
  },
  height: {
    type: String,
    default: '', // 預設不改變大小
  },
  size: {
    type: String,
    default: '', // small, medium, large
  }
});

const modalSizeClass = computed(() => {
  if (props.size === 'small') return 'w-96 h-auto';
  if (props.size === 'medium') return 'w-2/3 h-auto';
  if (props.size === 'large') return 'w-[90vw] h-[90vh]';
  if (!props.width) return 'w-224'; // 如果沒有 width，預設 w-224
  return ''; // width 已經透過 style 傳入
});

defineEmits(['close']);
</script>
