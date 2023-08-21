import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-investigation', () => {
  const initialState = {
    page: 'list',
    modal: '',
    pdfForm: {
      title: 'Investigation Report',
      subject: 'Subject',
      remark: '',
    },
    dataType: 'all',
    selectedTask: null,
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
  }

  const modal = ref('');
  function setModal(data) {
    modal.value = data;
  }

  const pdfForm = ref(null);
  function setPdfForm(data) {
    pdfForm.value = data;
  }

  function initStore() {
    setPage(initialState.page);
    setDataType(initialState.dataType);

    setModal(initialState.modal);
    setPdfForm(initialState.pdfForm);
  }

  return {
    initStore,

    page,
    setPage,

    modal,
    setModal,

    pdfForm,
    setPdfForm,

    dataType,
    setDataType,

    selectedTask,
    setSelectedTask,
  };
});
