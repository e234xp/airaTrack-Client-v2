import { ref } from 'vue';
import { defineStore } from 'pinia';

import * as actions from './actions';

export default defineStore('module-config', () => {

  function initStore() {}
  const page = ref('video');

  function setPage(val) {
    page.value = val;
  }

  return {
    ...actions,
    initStore,
    page,
    setPage
  };
});