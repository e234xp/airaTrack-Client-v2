import { defineStore } from 'pinia';
import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

export default defineStore('module-case', () => {

  function initStore() {}

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
    initStore,
    getCase,
    getCaseDetail,
    deleteCase
  };
});