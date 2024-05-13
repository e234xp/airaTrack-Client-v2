import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-initial', () => {

  function initStore() {}

  const page = ref('video');
  function setPage(val) {
    page.value = val;
  }

  return {
    initStore,

    page,
    setPage,
  };
});