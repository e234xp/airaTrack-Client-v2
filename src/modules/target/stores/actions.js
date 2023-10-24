import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

// =============================================
// POST
// =============================================
export async function getLiveFaceHourlyCount(date, cameraList) {
  const userStore = useUserStore();
  const result = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/livefacehourlycount`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      report_date: date,
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

export async function addAlbum(data) {
  const userStore = useUserStore();
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data
  });
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
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photoFeature`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data
  });
}

export async function uploadPhoto(image) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/uploadPhoto`,
    method: 'post',
    headers: { sessionId: userStore.sessionId },
    data: {
      face_image: image
    },
  });
}

// =============================================
// GET
// =============================================
export async function getAlbum() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
    method: 'get',
    headers: { sessionId: userStore.sessionId },
  })
}

export async function getLicense() {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/license`,
    method: 'get',
    headers: { sessionId: userStore.sessionId },
  });
}

export async function getAlbumData(albumId) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albumdata`,
    method: 'get',
    headers: { sessionId: userStore.sessionId },
    params: {
      albumId
    },
  })
}

export async function getAlbumPhoto(photoId) {
  const userStore = useUserStore();
  return await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photo`,
    method: 'get',
    headers: { sessionId: userStore.sessionId },
    params: {
      photoName: photoId,
    },
  })
}

// =============================================
// DELETE
// =============================================
export async function deleteAlbumPhoto(data) {
  const userStore = useUserStore();
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photo`,
    method: 'delete',
    headers: { sessionId: userStore.sessionId },
    data,
  });
}

export async function deleteAlbum(albumId) {
  const userStore = useUserStore();
  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
    method: 'delete',
    headers: { sessionId: userStore.sessionId },
    data: { albumId }
  });
}