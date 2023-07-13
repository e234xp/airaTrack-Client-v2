<template>
  <div
    :style="{ backgroundImage: spiderman.base64Image.getStyle(background) }"
    class="h-screen bg-cover"
  >
    <AppError
      :is-show="errorStore.isShow"
      :title="errorStore.header"
      :body="errorStore.body"
      @close="errorStore.close"
    />
    <RouterView />
  </div>
</template>

<script setup>
import { inject } from 'vue';

import background from '@/assets/base64-images/background';

import errorStore from '@/stores/error';

const spiderman = inject('$spiderman');

</script>
