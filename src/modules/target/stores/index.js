import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-target', () => {
  const initialState = {
    selectedFace: null,
    selectedFaceKey: null,
    confirmingFaces: [],
    confirmedFace: null,
    page: 'list',
  };

  const selectedFace = ref(initialState.selectedFace);
  function setSelectedFace(data) {
    selectedFace.value = data;
  }

  const selectedFaceKey = ref(initialState.selectedFaceKey);
  function setSelectedFaceKey(data) {
    selectedFaceKey.value = data;
  }

  const confirmingFaces = ref(initialState.confirmingFaces);
  function setConfirmingFaces(data) {
    confirmingFaces.value = data;
  }

  const confirmedFace = ref(initialState.confirmedFace);
  function setConfirmedFace(data) {
    confirmedFace.value = data;
  }

  const page = ref(initialState.page);
  function setPage(data) {
    page.value = data;
  }

  function initStore() {
    setSelectedFace(initialState.selectedFace);
    setPage(initialState.page);
    setSelectedFaceKey(initialState.selectedFaceKey);
    setConfirmingFaces(initialState.confirmingFaces);
    setConfirmedFace(initialState.confirmedFace);
  }

  return {
    selectedFace,
    selectedFaceKey,
    confirmingFaces,
    confirmedFace,
    page,

    setSelectedFace,
    setSelectedFaceKey,
    setConfirmingFaces,
    setConfirmedFace,
    setPage,

    initStore,
  };
});
