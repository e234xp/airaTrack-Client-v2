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
    bookmarkForm: {
      firstResult: null,
      resultLength: null,
      description: '',
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

  const bookmarkForm = ref(null);
  function setBookmarkForm(data) {
    bookmarkForm.value = data;
  }

  function initStore() {
    setPage(initialState.page);
    setDataType(initialState.dataType);

    setModal(initialState.modal);
    setPdfForm(initialState.pdfForm);
    setBookmarkForm(initialState.bookmarkForm);
  }

  return {
    initStore,

    page,
    setPage,

    modal,
    setModal,

    pdfForm,
    setPdfForm,

    bookmarkForm,
    setBookmarkForm,

    dataType,
    setDataType,

    selectedTask,
    setSelectedTask,
  };
});
