import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

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
