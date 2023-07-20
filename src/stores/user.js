import { ref, inject } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('user', () => {
  const spiderman = inject('$spiderman');

  const user = ref(null);
  const sessionId = ref('');

  async function loginUser(form) {
    const {
      data: {
        sessionId: tmpSessionId, user: tmpUser,
      },
    } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/login`,
      method: 'post',
      data: form,
    });

    return { sessionId: tmpSessionId, user: tmpUser };
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

  return {
    sessionId,
    user,
    loginUser,
    setUser,
    startMaintainUser,
  };
});
