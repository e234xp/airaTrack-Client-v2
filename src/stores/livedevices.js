import { ref } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';

export default defineStore('livedevice', () => {
  const livedevices = ref([]);

  async function getLiveDevices(sessionId) {
    const { data: { data } } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/livedevices`,
      method: 'get',
      headers: { sessionId },
    });

    return data;
  }

  function setLiveDevices(data) {
    livedevices.value = data;
  }

  return {
    livedevices,
    getLiveDevices,
    setLiveDevices,
  };
});
