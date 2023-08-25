import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-target', () => {
  const initialState = {
    selectedFace: null,
    selectedFaceKey: null,
    confirmingFaces: [],
    confirmedFace: null,
    selectedAlbum: null,
    page: 'list',
    modal: '',
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

  const selectedAlbum = ref(initialState.selectedAlbum);
  function setSelectedAlbum(data) {
    selectedAlbum.value = data;
  }

  const page = ref(initialState.page);
  function setPage(data) {
    page.value = data;
  }

  const modal = ref('');
  function setModal(data) {
    modal.value = data;
  }

  function initStore() {
    setPage(initialState.page);
    setModal(initialState.modal);

    setSelectedFace(initialState.selectedFace);
    setSelectedFaceKey(initialState.selectedFaceKey);
    setConfirmingFaces(initialState.confirmingFaces);
    setConfirmedFace(initialState.confirmedFace);
    setSelectedAlbum(initialState.selectedAlbum);
  }

  return {
    initStore,

    page,
    setPage,

    modal,
    setModal,

    selectedFace,
    setSelectedFace,

    selectedFaceKey,
    setSelectedFaceKey,

    confirmingFaces,
    setConfirmingFaces,

    confirmedFace,
    setConfirmedFace,

    selectedAlbum,
    setSelectedAlbum,

  };
});
