import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

export default defineStore('module-case', () => {

  function initStore() {}

  const modal = ref('');
  function setModal(data) {
    modal.value = data;
  }

  async function getCase() {
    const userStore = useUserStore();
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/cases`,
      method: 'get',
      headers: { sessionId: userStore.sessionId }
    })
  }

  async function getCaseDetail(id) {
    const userStore = useUserStore();
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/cases`,
      method: 'get',
      headers: { sessionId: userStore.sessionId },
      params: {
        caseId: id
      }
    })
  }

  async function deleteCase(id) {
    const userStore = useUserStore();
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/cases`,
      method: 'delete',
      headers: { sessionId: userStore.sessionId },
      params: {
        caseId: id
      }
    })
  }

  return {
    modal,
    setModal,

    initStore,
    getCase,
    getCaseDetail,
    deleteCase
  };
});