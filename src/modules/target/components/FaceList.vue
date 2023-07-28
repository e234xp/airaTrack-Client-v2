<template>
  <div class="aira-row-auto-2 gap-8">
    <div
      v-for="face in faces"
      :key="face.data.id"
      @click="onToggleFace(face)"
      class="select-none relative cursor-pointer border-4"
    >
      <img
        class="w-full h-full"
        :src="spiderman.base64Image.getSrc(face.data.face_image)"
        alt=""
      >
      <div class="absolute top-0 left-0 w-full h-full flex justify-end items-end">
        <div
          class="w-8 h-8 rounded flex justify-center items-center
                        text-lg font-bold"
          :class="{
            'bg-white text-gray-800': face.data.id !== 1,
          }"
        >
          1
        </div>
      </div>
      <template
        v-if="face.data.id === selectedFace?.data.id"
      >
        <div
          class="absolute inset-0 bg-gray-900 opacity-40"
        />
        <div
          class="absolute top-0 left-0 w-full h-full
                       flex items-center justify-center"
        >
          <AppSvgIcon
            name="icon-check"
            class="text-white w-16 h-16"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import spiderman from '@/spiderman';

defineProps({
  faces: {
    type: Array,
    default() {
      return [];
    },
  },
  selectedFace: {
    type: Object,
    default() {
      return null;
    },
  },
  onToggleFace: {
    type: Function,
    default: () => {},
  },
});
</script>
