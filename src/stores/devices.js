import spiderman from '@/spiderman';
import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('device', () => {
  const devices = ref([]);

  async function getDevices(sessionId) {
    const { data } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/devices`,
      method: 'get',
      headers: { sessionId },
    });

    return data;
  }

  function setDevices(data) {
    devices.value = data;
  }

  const livedevices = ref([]);

  async function getLiveDevices(sessionId) {
    const { data } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/livedevices`,
      method: 'get',
      headers: { sessionId },
    });

    return data;
  }

  function setLiveDevices(data) {
    livedevices.value = data;
  }

  function findDevice(cameraId) {
    return cameraId
      ? livedevices.value.find((device) => device.camera_id === cameraId)
          ?? devices.value.find((device) => device.camera_id === cameraId)
      : 'Album photo';
  }

  return {
    devices,
    getDevices,
    setDevices,
    livedevices,
    getLiveDevices,
    setLiveDevices,

    findDevice,
  };
});
