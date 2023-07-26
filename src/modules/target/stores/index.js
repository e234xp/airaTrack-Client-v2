import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-target', () => {
  const initialState = {
    selectedFace: null,
    page: 'wall',
  };
  const selectedFace = ref(initialState.selectedFace);
  const page = ref(initialState.page);

  function setSelectedFace(data) {
    selectedFace.value = data;
  }

  function setPage(data) {
    page.value = data;
  }

  function initStore() {
    setSelectedFace(initialState.selectedFace);
    setPage(initialState.page);
  }

  return {
    selectedFace,
    page,
    setSelectedFace,
    setPage,
    initStore,
  };
});
