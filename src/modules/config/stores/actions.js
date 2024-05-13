import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

let trackConfig = {};
let serverConfig = {};

// =============================================
// DEL
// =============================================
export async function deleteUsers(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Users`,
    method: 'delete',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

// =============================================
// POST
// =============================================
export async function postNxServerInfo(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/configs/nxServerInfo`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

export async function postNxConfig(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Configs/nx`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

export async function postUsers(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Users`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

export async function postTrackConfig(payload) {
  trackConfig.face_merge_score = payload.mergeScore;
  trackConfig.watch_list_score = payload.watchScore;
  trackConfig.db.db_root_folder = payload.folder;
  trackConfig.db.single_file_time = payload.singleFile;
  trackConfig.db.maintain_duration = payload.faceRetention;

  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Configs/track`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      face_capture: trackConfig
    }
  })
}

export async function postServerConfig(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Configs/server`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...serverConfig,
      ...payload
    }
  })
}

export async function postLiveDevice(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livedevices`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

export async function activateLicense(key) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/license`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      license_key: key
    }
  })
}

export async function postUserGroup(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/UserGroups`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

// =============================================
// PUT
// =============================================
export async function putUsers(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Users`,
    method: 'put',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

export async function putUserGroup(payload) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/UserGroups`,
    method: 'put',
    headers: { sessionId: userStore.sessionId },
    data: {
      ...payload
    }
  })
}

// =============================================
// GET
// =============================================
export async function getNxConfig() {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Configs/nx`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
  return result;
}

export async function getTrackConfig() {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Configs/track`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
  trackConfig = JSON.parse(JSON.stringify(result.face_capture));
  return { ...result?.face_capture?.db || {},
    face_merge_score: result?.face_capture?.face_merge_score || -1,
    watch_list_score: result?.face_capture?.watch_list_score || -1 };
}

export async function getUsers() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Users`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
}

export async function getUserGroup() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/UserGroups`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
}

export async function getLicense() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/license`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
}

export async function getDevices() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/devices`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
}

export async function getLiveDevices() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livedevices`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
}

export async function getServerConfig() {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/Configs/server`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
  serverConfig = JSON.parse(JSON.stringify(result));
  return result;
}

export async function restartLicense() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/restart`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
}

// =============================================
// DELETE
// =============================================
export async function deleteLiveDevice(id) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livedevices`,
    method: 'delete',
    headers: { sessionId: userStore.sessionId },
    params: {
      camera_id: id
    }
  })
}