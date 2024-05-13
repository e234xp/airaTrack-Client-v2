import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';
import useDevices from '@/stores/devices';
import useAlbums from '@/stores/albums';

import * as actions from './actions';

export default defineStore('module-target', () => {
  const isInit = ref(false);

  const initialState = {
    selectedFace: null,
    selectedFaceKey: null,
    confirmingFaces: [],
    confirmedFace: null,
    selectedAlbum: [],
    selectedAlbumDetail: '',
    selectedCamera: [],
    selectedCameraType: 'all',
    selectedAlbumType: 'all',
    selectedTimeType: 'now',
    selectedHour: parseInt(spiderman.dayjs().format('HH'), 10),
    selectedDate: spiderman.dayjs().format('YYYY-MM-DD'),
    page: 'list',
    faceListRow: 0,
    faceListCol: 0,
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

  const faceListRow = ref(initialState.faceListRow);
  const faceListCol = ref(initialState.faceListCol);
  function setFaceListSize(data) {
    const { row, col } = data;
    faceListRow.value = row;
    faceListCol.value = col;
  }

  const page = ref(initialState.page);
  function setPage(data) {
    page.value = data;
  }

  const modal = ref('');
  function setModal(data) {
    modal.value = data;
  }

  const selectedCameraType = ref(initialState.selectedCameraType);
  function setSelectedCameraType(data) {
    selectedCameraType.value = data;
  }

  const selectedAlbumType = ref(initialState.selectedAlbumType);
  function setSelectedAlbumType(data) {
    selectedAlbumType.value = data;
  }

  const selectedTimeType = ref(initialState.selectedTimeType);
  function setSelectedTimeType(data) {
    selectedTimeType.value = data;
  }

  const selectedHour = ref(initialState.selectedHour);
  function setSelectedHour(data) {
    selectedHour.value = data;
  }

  const selectedDate = ref(initialState.selectedDate);
  function setSelectedDate(data) {
    selectedDate.value = data;
  }

  function initStore() {
    setPage(initialState.page);
    setModal(initialState.modal);

    setSelectedFace(initialState.selectedFace);
    setSelectedFaceKey(initialState.selectedFaceKey);
    setConfirmingFaces(initialState.confirmingFaces);
    setConfirmedFace(initialState.confirmedFace);

    if (isInit.value) return;
    
    const albumStore = useAlbums();
    setSelectedAlbum(['', ...albumStore.albums.map(({ albumId }) => albumId)]);

    const deviceStore = useDevices();
    setSelectedCamera(deviceStore.livedevices.map(({ camera_id: cameraId }) => cameraId));

    isInit.value = true;
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
    setSelectedAlbumDetail,

    selectedCameraType,
    setSelectedCameraType,

    selectedAlbumType,
    setSelectedAlbumType,

    selectedTimeType,
    setSelectedTimeType,

    selectedHour,
    setSelectedHour,

    selectedDate,
    setSelectedDate,

    faceListRow,
    faceListCol,
    setFaceListSize
  };
});
