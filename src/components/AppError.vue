<template>
  <transition name="fade">
    <div
      v-show="isShow"
      class="flex justify-center"
    >
      <div
        class="w-full lg:w-6/12 2xl:w-4/12
       bg-red-100 border border-red-400 text-red-700 mt-3 px-4 py-3 rounded fixed"
      >
        <div class="flex justify-start">
          <div class="whitespace-nowrap font-bold mr-4">
            {{ $t(title) }}
          </div>
          <div class="mr-6">
            {{ $t(body) }}
          </div>
        </div>
        <span class="absolute top-0 right-0 px-4 py-3">
          <svg
            @click="$emit('close')"
            class="fill-current h-6 w-6 text-red-500"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  isShow: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: '',
  },
  body: {
    type: String,
    default: '',
  },
});
defineEmits(['close']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
