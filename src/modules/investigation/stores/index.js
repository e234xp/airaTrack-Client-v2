import { ref } from 'vue';
import { defineStore, storeToRefs } from 'pinia';
import spiderman from '@/spiderman';
import useDevices from '@/stores/devices';

import * as actions from './actions';

export default defineStore('module-investigation', () => {
  const initialState = {
    page: 'list',
    modal: '',
    pdfForm: {
      title: 'Investigation Report',
      subject: 'Subject',
      remark: '',
    },
    bookmarkForm: {
      description: '',
    },
    archiveForm: {
      title: 'Investigation Report',
      subject: 'Subject',
      remark: '',
    },
    selectedExport: {
      firstResult: null,
      resultLength: null
    },
    dataType: 'all',
    selectedTask: null,
    fromCase: false
  };

  const page = ref(initialState.page);
  function setPage(data) {
    page.value = data;
  }

  const dataType = ref(initialState.dataType);
  function setDataType(data) {
    dataType.value = data;
  }

  const selectedTask = ref(initialState.selectedTask);
  function setSelectedTask(data) {
    selectedTask.value = data;
    fromCase.value = false;
  }

  const modal = ref('');
  function setModal(data) {
    modal.value = data;
  }

  const pdfForm = ref(null);
  function setPdfForm(data) {
    pdfForm.value = data;
  }

  const bookmarkForm = ref(null);
  function setBookmarkForm(data) {
    bookmarkForm.value = data;
  }

  const archiveForm = ref(null);
  function setArchiveForm(data) {
    archiveForm.value = data;
  }

  const selectedExport = ref(null);
  function setSelectedExport(data) {
    selectedExport.value = data;
  }

  const fromCase = ref(false);
  const caseData = ref(null);
  function setCaseData(data) {
    const devicesStore = useDevices();
    const { devices } = storeToRefs(devicesStore);
    const { caseName, target, timestamp, search_start_time, search_end_time,
      media_list_live, media_list_arch, facesData } = data;
    caseData.value = {
      target: {
        camera_id: target.camera_id,
        timestamp: spiderman.dayjs(timestamp)
      },
      target_face_image: target.faceImage,
      feature: target.feature,
      target_score: target.score,
      search_motion: true,
      subtasks: [],
      search_interval_ms: 1000,
      search_start_time: search_start_time,
      search_end_time: search_end_time,
      task_name: caseName,
      livechannels: media_list_live.map((id) => devices.value.find((d) => d.camera_id === id)).filter((item) => item !== undefined),
      archchannels: media_list_arch.map((id) => devices.value.find((d) => d.camera_id === id)).filter((item) => item !== undefined),
      task_id: '',
      data_type: 'finish',
      progress: 100,
      live_task: 'false',
      arch_task: 'false',
      running_start_time: 0,
      running_end_time: 0,
      facesData
    }
  }

  function switchCaseData() {
    selectedTask.value = caseData.value;
    caseData.value = null;
    fromCase.value = true;
  }

  function initStore() {
    setPage(initialState.page);
    setDataType(initialState.dataType);

    setModal(initialState.modal);
    setPdfForm(initialState.pdfForm);
    setBookmarkForm(initialState.bookmarkForm);
  }

  return {
    ...actions,
    initStore,

    page,
    setPage,

    modal,
    setModal,

    pdfForm,
    setPdfForm,

    bookmarkForm,
    setBookmarkForm,

    archiveForm,
    setArchiveForm,

    dataType,
    setDataType,

    selectedTask,
    setSelectedTask,

    selectedExport,
    setSelectedExport,

    fromCase,
    caseData,
    setCaseData,
    switchCaseData
  };
});
