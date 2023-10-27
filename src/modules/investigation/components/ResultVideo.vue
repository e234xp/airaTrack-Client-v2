<template>
  <div class="h-full pb-4 flex flex-col px-4">
    <div
      class="w-full bg-black flex justify-center"
      style="height: calc(100% - 8rem);"
      ref="panelRef"
    >
      <div class="relative" :style="{ width: `${width}px`, height: `${height}px` }">
        <video
          ref="videoRef"
          :key="videoUrl"
          autoplay
          @timeupdate="handleTimeUpdate"
          @ended="handleVideoEnded"
          @playing="handleVideoStarted"
          class="absolute w-full h-full"
          style="top: 50%; left: 50%; transform: translate(-50%, -50%);"
        >
          <source
            :src="videoUrl"
          >
        </video>
      </div>
    </div>

    <div class="px-4">
      <input
        type="range"
        class="w-full h-2 bg-gray-200
              rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        :min="0"
        :max="duration"
        :step="0.5"
        v-model="currentTime"
        @input="handleSliderInput"
      >
    </div>

    <slot name="select-video-bar" />

    <div class="mx-4 flex">
      <div class="flex-1 flex gap-2 items-center">
        <slot name="video-bar-download" />
      </div>
      <div class="flex-1 flex justify-center">
        <img
          src="@/assets/images/btn-prev.png"
          class="w-12 mx-1 cursor-pointer"
          @click="$emit('onPrev')"
        >
        <img
          src="@/assets/images/btn-play.png"
          v-if="!isPlaying"
          class="w-12 mx-1 cursor-pointer"
          @click="play"
        >
        <img
          src="@/assets/images/btn-pause.png"
          v-else
          class="w-12 mx-1 cursor-pointer"
          @click="pause"
        >
        <img
          src="@/assets/images/btn-next.png"
          class="w-12 mx-1 cursor-pointer"
          @click="$emit('onNext')"
        >
      </div>
      <div class="flex-1 flex justify-end">
        <slot name="video-bar-turn-page" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineExpose } from 'vue';

defineProps({
  videoUrl: {
    type: String,
    default: '',
  },
  duration: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits([
  'onEnd', 'onPrev', 'onNext',
]);

const width = ref(0);
const height = ref(0);

const videoRef = ref(null);
const panelRef = ref(null);

// 處理開始暫停
const isPlaying = ref(true);
function play() {
  const video = videoRef.value;
  video.play();
  isPlaying.value = true;
}
function pause() {
  const video = videoRef.value;
  video.pause();
  isPlaying.value = false;
}

// 處理時間條的客製化
const currentTime = ref(0);
function handleTimeUpdate() {
  if (!videoRef.value) return;
  currentTime.value = videoRef.value.currentTime;
}

function handleSliderInput() {
  videoRef.value.currentTime = currentTime.value;
}

// 處理結束的時候
function handleVideoEnded() {
  isPlaying.value = false;
  currentTime.value = 0;
  emit('onNext');
}

function handleVideoStarted() {
  isPlaying.value = true;
}

function sizeAdjust() {
  const tempH = panelRef.value.clientHeight;
  const tempW = panelRef.value.clientWidth;
  const ratio = tempH / tempW;
  if (ratio < 0.56) {
    height.value = tempH;
    width.value = tempH / 0.56;
  } else {
    width.value = tempW;
    height.value = tempW * 0.56;
  }
}
defineExpose({
  getCurrentTime,
  getSize,
  getContent
})

function getCurrentTime() {
  return videoRef.value.currentTime;
}

function getSize() {
  return { width: videoRef.value.clientWidth, height: videoRef.value.clientHeight };
}

function getContent() {
  return videoRef.value;
}

const containerObserver = new ResizeObserver(() => {
  sizeAdjust();
})

onMounted(async () => {
  containerObserver.observe(panelRef.value);
})

onBeforeUnmount(() => {
  containerObserver.unobserve(panelRef.value);
})
</script>
