<template>
  <div>
    <video
      ref="videoRef"
      :key="videoUrl"
      class="w-384"
      controls
      autoplay
      loop
      @timeupdate="handleTimeUpdate"
      @ended="handleVideoEnded"
      @playing="handleVideoStarted"
    >
      <source
        :src="videoUrl"
      >
    </video>
    <div>
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
    <div class="flex justify-center">
      <img
        src="@/assets/images/btn-prev.png"
        class="w-16 mx-1 cursor-pointer"
        @click="$emit('onPrev')"
      >
      <img
        src="@/assets/images/btn-play.png"
        v-if="!isPlaying"
        class="w-16 mx-1 cursor-pointer"
        @click="play"
      >
      <img
        src="@/assets/images/btn-pause.png"
        v-else
        class="w-16 mx-1 cursor-pointer"
        @click="pause"
      >
      <img
        src="@/assets/images/btn-next.png"
        class="w-16 mx-1 cursor-pointer"
        @click="$emit('onNext')"
      >
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

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
  'onEnded', 'onPrev', 'onNext',
]);

const videoRef = ref(null);

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
  // todo 刪除
  // console.log(videoRef.value.currentTime);
  currentTime.value = videoRef.value.currentTime;
}

function handleSliderInput() {
  // todo 刪除
  // console.log('set', typeof currentTime.value, currentTime.value);
  videoRef.value.currentTime = currentTime.value;
}

// 處理結束的時候
function handleVideoEnded() {
  isPlaying.value = false;
  emit('onEnded');
}

function handleVideoStarted() {
  isPlaying.value = true;
}
</script>
