import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';
import router from '@/router';

export default defineStore('user', () => {
  const dataForm = ref(null);
  const user = ref(null);
  const sessionId = ref('');
  
  const timeshift = ref(0);
  
  async function loginUser(form) {
    const {
      sessionId: tmpSessionId, user: tmpUser, timezone
    } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/login`,
      method: 'post',
      data: form,
    });

    const severTimezone = +(timezone.split(":")[0]);
    const timezoneOffset = new Date().getTimezoneOffset();
    const offsetHours = -(Math.floor(timezoneOffset / 60));
    timeshift.value = offsetHours - severTimezone;
    dataForm.value = form;

    return { sessionId: tmpSessionId, user: tmpUser };
  }

  async function reloginUser() {
    const {
      sessionId, user
    } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/login`,
      method: 'post',
      data: dataForm.value,
    });

    setUser({ sessionId, user });
    router.push({ path: '/target' })
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
    reloginUser,
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
    changePassword,

    timeshift
  };
});
