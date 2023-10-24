<template>
  <div
    :style="{ backgroundImage: spiderman.base64Image.getStyle(background) }"
    class="h-screen bg-cover font-custom"
  >
    <AppError
      :is-show="errorStore.isShow"
      :title="errorStore.header"
      :body="errorStore.body"
      @close="errorStore.close"
    />

    <AppSuccess
      :is-show="successStore.isShow"
      :body="successStore.body"
      @close="successStore.close"
    />

    <RouterView />

    <AppModal
      :is-open="modalStore.isOpen"
      :header="modalStore.header"
      :body="modalStore.body"
      :buttons="modalStore.buttons"
      @close="modalStore.close"
    />
  </div>
</template>

<script setup>
import spiderman from '@/spiderman';

import background from '@/assets/base64-images/background';

import errorStore from '@/components/AppError/error';
import successStore from '@/components/AppSuccess/success';
import modalStore from '@/components/AppModal/modal';

</script>
