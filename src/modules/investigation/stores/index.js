import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-investigation', () => {
  const initialState = {
    page: 'list',
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

  function initStore() {
    setPage(initialState.page);
    setDataType(initialState.dataType);
  }

  return {
    initStore,

    page,
    setPage,

    dataType,
    setDataType,

    selectedTask,
    setSelectedTask,
  };
});
