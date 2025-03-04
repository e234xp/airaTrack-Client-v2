<template>
  <div v-if="isOpen" class="fixed inset-0 z-40 backdrop-filter backdrop-blur-lg" />

  <!-- Modal -->
  <div v-if="isOpen" class="fixed inset-0 flex items-center justify-center z-50 text-white">
    <div
      id="🔥ModalLayout"
      class="relative border border-modal bg-modal rounded-lg shadow-cus p-10"
      :class="modalSizeClass"
      :style="{ width: width || '', height: height || '' }"
    >
      <div id="🔥ModalLayout__Close">
        <AppSvgIcon
          name="icon-close"
          class="w-6 h-6 cursor-pointer"
          @click="$emit('close')"
        />
      </div>

      <h2 id="🔥ModalLayout__Header" class="text-3xl text-primary">
        <slot name="header" />
      </h2>

      <div id="🔥ModalLayout__Left" class="mr-4 pt-4 pr-4">
        <slot name="description" />
      </div>
      <img id="🔥ModalLayout__LineY" src="@/assets/images/line-y.png">
      <div id="🔥ModalLayout__Right" >
        <slot/>
        <slot name="footer" />
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

<style>
#🔥ModalLayout {
  display: grid;
  grid-template-columns: repeat(21, 1fr);
  grid-template-rows: repeat(21, 1fr);
}

#🔥ModalLayout__Close {
  position: relative;
  left: 70%;
  grid-column: 21 / -1;
  grid-row: 1 / 2;
}

#🔥ModalLayout__Header {
  grid-column: 1 / -1;
  grid-row: 2 / 3;
}

#🔥ModalLayout__X {
  grid-column: 1 / -1;
  grid-row: 3 / -1;
}

#🔥ModalLayout__Left {
  grid-column: 1 / 6;
  grid-row: 3 / -1;
}

#🔥ModalLayout__LineY {
  grid-column: 6 / 7;
  grid-row: 3 / -1;
  height: 100%;
}

#🔥ModalLayout__Right {
  grid-column: 7 / -1;
  grid-row: 3 / -1;
}
</style>