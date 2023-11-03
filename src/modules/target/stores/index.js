import { ref } from 'vue';
import { defineStore } from 'pinia';
import useDevices from '@/stores/devices';
import useAlbums from '@/stores/albums';

import * as actions from './actions';

export default defineStore('module-target', () => {
  const initialState = {
    selectedFace: null,
    selectedFaceKey: null,
    confirmingFaces: [],
    confirmedFace: null,
    selectedAlbum: [],
    selectedAlbumDetail: '',
    selectedCamera: [],
    page: 'list',
    modal: '',
  };

  const selectedCamera = ref(initialState.selectedCamera);
  function setSelectedCamera(data) {
    selectedCamera.value = data;
  }

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

  const selectedAlbumDetail = ref(initialState.selectedAlbumDetail);
  function setSelectedAlbumDetail(data) {
    selectedAlbumDetail.value = data;
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

    const albumStore = useAlbums();
    setSelectedAlbum(albumStore.albums.map(({ albumId }) => albumId));

    const deviceStore = useDevices();
    setSelectedCamera(deviceStore.livedevices.map(({ camera_id: cameraId }) => cameraId));
  }

  return {
    ...actions,

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

    selectedCamera,
    setSelectedCamera,

    selectedAlbumDetail,
    setSelectedAlbumDetail
  };
});
