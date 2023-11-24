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

  const path = ref('');
  function setPath(val) {
    path.value = val;
  }

  return {
    sessionId,
    user,
    logout,
    loginUser,
    setUser,
    startMaintainUser,

    path,
    setPath
  };
});
