import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('user', () => {
  const sessionId = ref('');
  const user = ref(null);

  function saveLoginData(data) {
    sessionId.value = data.sessionId;
    user.value = data.user;
  }

  return {
    sessionId,
    user,
    saveLoginData,
  };
});
