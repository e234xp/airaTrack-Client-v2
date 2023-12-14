<template>
  <div
    :style="{ backgroundImage: spiderman.base64Image.getStyle(background), height: `${height}px` }"
    class="bg-cover font-custom"
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
import { onMounted, onBeforeUnmount, ref } from 'vue';
import spiderman from '@/spiderman';

import background from '@/assets/base64-images/background-gray';

import errorStore from '@/components/AppError/error';
import successStore from '@/components/AppSuccess/success';
import modalStore from '@/components/AppModal/modal';

import useDebugStore from '@/stores/debug';
const store = useDebugStore();
const { setTestMode } = store;

const height = ref(0);

function documentHeight() {
  height.value = window.innerHeight;
}

onMounted(() => {
  window.addEventListener('resize', documentHeight);
  documentHeight();
  window.test = (flag) => {
    setTestMode(flag);
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', documentHeight);
})

</script>
