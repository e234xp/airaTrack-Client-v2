import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';
import { ESTest } from 'mike-testt';

// =============================================
// POST
// =============================================
export async function getLiveFaceHourlyCount(start, end, cameraList) {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livefacehourlycount`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      start_time: start * 1000,
      end_time: end * 1000,
      camera_list: cameraList,
    },
  });
  return result.data;
}

export async function getLiveFaceImage(faceFile) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livefaceimage`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      face_file: faceFile,
    },
  })
}

export async function addTask(data) {
  const userStore = useUserStore();
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/v2/addtask`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data
  })
}

export async function addPhotoFeature(data) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photoFeature`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data
  });
}

export async function uploadPhoto(image, albumId) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/uploadPhoto`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      face_image: image,
      albumId
    },
  });
}

// =============================================
// GET
// =============================================

export async function getLicense() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/license`,
    method: 'get',
    headers: { sessionId: userStore.sessionId },
  });
}

export async function getAllMaps() {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/maps`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })

  {
    ESTest(result.data, 'array')
    ESTest(result.data[0].uuid, 'string')
    ESTest(result.data[0].name, 'string')
    ESTest(result.data[0].cameras, 'array')
    ESTest(result.data[0].cameras[0].type, 'string')
    ESTest(result.data[0].cameras[0].module, 'string')
    ESTest(result.data[0].cameras[0].camera_id, 'string')
    ESTest(result.data[0].cameras[0].name, 'string')
    ESTest(result.data[0].cameras[0].position.x, 'number')
    ESTest(result.data[0].cameras[0].position.y, 'number')
    ESTest(result.data[0].last_modify_time, 'number')
  }
  return result;
}

export async function getMapImage(uuid) {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/maps/image?uuid=${uuid}`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
  return result;
}

export async function getAllArchDevices() {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/archdevices`,
    method: 'get',
    headers: { sessionId: userStore.sessionId }
  })
  return result;
}