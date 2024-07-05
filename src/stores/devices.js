import spiderman from '@/spiderman';
import { ref } from 'vue';
import { defineStore } from 'pinia';

const TIME_OUT = 180000;

export default defineStore('device', () => {
  const devices = ref([]);

  async function getDevices(sessionId) {
    const apiPromise = new Promise(async (resolve, reject) => {
      const { data } = await spiderman.apiService({
        url: `${spiderman.system.apiBaseUrl}/airaTracker/devices`,
        method: 'get',
        headers: { sessionId },
      });
      resolve(data || []);
    });

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve([]), TIME_OUT);
    });

    return Promise.race([apiPromise, timeoutPromise]);
  }

  function setDevices(data, vms) {
    const { host, password, username, authorization } = vms;
    data.forEach((item) => {
      if (item.server.ip === host && item.server.pass === password && item.server.user === username) {
        item.server.authorization = authorization;
      }
    })
    devices.value = data;
  }

  const livedevices = ref([]);

  async function getLiveDevices(sessionId) {
    const apiPromise = new Promise(async (resolve, reject) => {
      const { data } = await spiderman.apiService({
        url: `${spiderman.system.apiBaseUrl}/airaTracker/livedevices`,
        method: 'get',
        headers: { sessionId },
      });
      if (data) resolve(data);
      else reject([]);
    });

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve([]), TIME_OUT);
    });

    return Promise.race([apiPromise, timeoutPromise]);
  }

  function setLiveDevices(data) {
    livedevices.value = data;
  }

  function findDevice(cameraId) {
    if (!cameraId) return { name: '--' };
    return [ ...devices.value, ...livedevices.value ].find((device) => device.camera_id === cameraId) || { name: '--' };
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
