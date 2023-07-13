<template>
  <div
    :style="{ backgroundImage: spiderman.base64Image.getStyle(background) }"
    class="h-screen bg-cover"
  >
    <AppError
      :is-show="errorIsShow"
      :title="errorTitle"
      :body="errorBody"
      @close="errorClose"
    />
    <RouterView />
  </div>
</template>

<script setup>
import { inject } from 'vue';
import { storeToRefs } from 'pinia';

import background from '@/assets/base64-images/background';

import useErrorStore from '@/stores/error';

const spiderman = inject('$spiderman');

const errorStore = useErrorStore();
const {
  isShow: errorIsShow,
  title: errorTitle,
  body: errorBody,
  close: errorClose,
} = storeToRefs(errorStore);
</script>
