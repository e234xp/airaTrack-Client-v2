import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';

export default defineStore('user', () => {
  const user = ref(null);
  const sessionId = ref('');
  
  async function loginUser(form) {
    const {
      sessionId: tmpSessionId, user: tmpUser,
    } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/login`,
      method: 'post',
      data: form,
    });

    return { sessionId: tmpSessionId, user: tmpUser };
  }

  async function logout() {
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/logout`,
      method: 'post',
      headers: {
        sessionId: sessionId.value,
      }
    });
  }

  function setUser(data) {
    ({ user: user.value, sessionId: sessionId.value } = data);
  }

  function startMaintainUser() {
    setInterval(async () => {
      await spiderman.apiService({
        url: `${spiderman.system.apiBaseUrl}/airaTracker/expiretime/extend`,
        method: 'get',
        headers: {
          sessionId: sessionId.value,
        },
      });

      console.log('Maintain SessionId');
    }, 60 * 1000);
  }

  const admin = ref(false);
  function setRole(list) {
    admin.value = (list.find((item) => item.id === user.value.groups[0])?.code || '') === '001';
  }

  const path = ref('');
  function setPath(val) {
    path.value = val;
  }

  const isAdding = ref(false);
  function startAddtoCase() {
    isAdding.value = true;
  }
  function finishAddtoCase() {
    isAdding.value = false;
  }

  async function resetLicensePassword(payload) {
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/password/license`,
      method: 'post',
      data: payload,
    });
  }

  async function changePassword(payload) {
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/password/change`,
      method: 'post',
      data: payload,
    });
  }

  return {
    sessionId,
    user,
    logout,
    loginUser,
    setUser,
    startMaintainUser,

    path,
    setPath,

    isAdding,
    startAddtoCase,
    finishAddtoCase,

    admin,
    setRole,

    resetLicensePassword,
    changePassword
  };
});
