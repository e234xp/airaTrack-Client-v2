<template>
  <!-- 32px + 8px + 24px -->
  <div class="flex mb-6">
    <div class="relative bg-primary-hover w-3/5 pl-8 py-1 mr-7 text-white text-2xl title">
      <slot></slot>
    </div>
    <div class="bg-primary-hover mr-2.5" style="width: 20px; transform: skewX(-30deg);"></div>
    <div class="bg-primary-hover" style="width: 12px; transform: skewX(-30deg);"></div>
  </div>
</template>

<script setup>

</script>

<style scoped>
.title {
  border-top-right-radius: 0 !important;
}

.title::after {
  position: absolute;
  z-index: 1;
  content: '';
  top: 0px;
  right: -12px;
  width: 36px;
  height: 2.5rem;
  background: #2c77a0;
  transform: skew(-30deg);
}
</style>
