<template>
  <div
    :style="{ backgroundImage: backgroundStyle }"
    class="h-screen bg-cover"
  >
    <RouterView />
  </div>
</template>

<script setup>
import { inject } from 'vue';

import background from '@/assets/base64-images/background';

const spiderman = inject('$spiderman');

const backgroundStyle = spiderman.base64Image.getStyle(background);
</script>

<style>
</style>
