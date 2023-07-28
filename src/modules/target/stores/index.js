import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-target', () => {
  const initialState = {
    selectedFace: null,
    page: 'list',
    selectedFaceKey: null,
  };
  const selectedFace = ref(initialState.selectedFace);
  const page = ref(initialState.page);
  const selectedFaceKey = ref(initialState.selectedFaceKey);

  function setSelectedFace(data) {
    selectedFace.value = data;
  }

  function setPage(data) {
    page.value = data;
  }

  function setSelectedFaceKey(data) {
    selectedFaceKey.value = data;
  }

  function initStore() {
    setSelectedFace(initialState.selectedFace);
    setPage(initialState.page);
    setSelectedFaceKey(initialState.selectedFaceKey);
  }

  return {
    selectedFace,
    page,
    selectedFaceKey,

    setSelectedFace,
    setPage,
    setSelectedFaceKey,

    initStore,
  };
});
