<template>
  <div
    :style="{ backgroundImage }"
    class="h-screen bg-cover"
  >
    123
  </div>
</template>

<script setup>
import background from '@/assets/base64-images/background';

const backgroundImage = `url('data:image/png;base64, ${background}')`;
</script>

<style>
</style>
