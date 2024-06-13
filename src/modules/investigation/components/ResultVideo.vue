<template>
  <div class="h-full flex flex-col pl-4 pb-4 pr-2">
    <div
      class="relative w-full bg-black flex justify-center"
      style="height: calc(100% - 8rem);"
      ref="panelRef"
    >
      <div class="absolute"
        style="top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%;">
        <video
          ref="videoRef"
          :key="videoUrl"
          playsinline="playsinline"
          autoplay
          controlslist="nodownload"
          @stalled="handleVideoStalled"
          @timeupdate="handleTimeUpdate"
          @ended="handleVideoEnded"
          @playing="handleVideoStarted"
          class="absolute w-full h-full"
        >
          <source
            :src="parseUrl"
            v-if="!isIos"
          >
          <source
            :src="parseUrl"
            type="application/x-mpegurl"
            v-else
          >
        </video>
      </div>
      <div class="absolute right-2 top-1 text-white text-xl">
        <slot name="timestamp" />
      </div>
    </div>

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

    <slot name="select-video-bar" />

    <!-- background-image: linear-gradient(45deg,#404040 0,#131617 70%) -->
    <div class="flex">
      <div class="flex-1 flex gap-2 items-center">
        <slot name="video-bar-download" />
      </div>
      <div class="flex-1 flex justify-center rounded-full border border-white/80 bg-ctrl-secondary"
      style="max-width: 18rem; box-shadow: inset 1px 1px 4px rgba(0,0,0,0.6), inset -1px -1px 4px rgba(255,255,255,0.2);">
        <div class="px-4 cursor-pointer hover:bg-ctrl-secondary-hover">
          <img
            src="@/assets/images/btn-prev.png"
            class="w-12"
            @click="$emit('onPrev')"
          >
        </div>
        <div class="px-4 cursor-pointer hover:bg-ctrl-secondary-hover" v-if="!isPlaying">
          <img
            src="@/assets/images/btn-play.png"
            class="w-12 cursor-pointer"
            @click="play"
          >
        </div>
        <div class="px-4 cursor-pointer hover:bg-ctrl-secondary-hover" v-else>
          <img
            src="@/assets/images/btn-pause.png"
            class="w-12 cursor-pointer"
            @click="pause"
          >
        </div>
        <div class="px-4 cursor-pointer hover:bg-ctrl-secondary-hover">
          <img
            src="@/assets/images/btn-next.png"
            class="w-12 cursor-pointer"
            @click="$emit('onNext')"
          >
        </div>
      </div>
      <div class="flex-1 flex justify-end">
        <slot name="video-bar-turn-page" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onBeforeMount, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/investigation/stores/index';

const store = useStore();
const { modal } = storeToRefs(store);

const props = defineProps({
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

const isIos = ref(false);

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

const parseUrl = computed(() => {
  if (!props.videoUrl) return '';
  return isIos.value ? props.videoUrl.replace('webm', 'ts') : props.videoUrl;
})

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
  if (isIos.value) return;
  isPlaying.value = false;
  currentTime.value = 0;
  emit('onNext');
}

function handleVideoStarted() {
  isPlaying.value = true;
}

function handleVideoStalled() {
  emit('onNext');
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
  getSize
})

function getCurrentTime() {
  return currentTime.value;
}

function getSize() {
  return { width: videoRef.value.clientWidth, height: videoRef.value.clientHeight };
}

watch(currentTime, async (time) => {
  if (!isIos.value) return;
  if (time >= props.duration) {
    isPlaying.value = false;
    currentTime.value = 0;
    emit('onNext');
  }
});

const tempPlayStatus = ref(false);
watch(modal, (value) => {
  if (value === '') {
    if (tempPlayStatus.value) {
      play();
    }
  } else {
    tempPlayStatus.value = isPlaying.value;
    pause();
  }
});

const containerObserver = new ResizeObserver(() => {
  sizeAdjust();
})

onBeforeMount(() => {
  isIos.value = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  // isIos.value = true;
}),

onMounted(async () => {
  containerObserver.observe(panelRef.value);
})

onBeforeUnmount(() => {
  containerObserver.unobserve(panelRef.value);
})
</script>
