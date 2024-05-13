import spiderman from '@/spiderman';
import { ref } from 'vue';
import { defineStore } from 'pinia';

import useUserStore from '@/stores/user';

export default defineStore('album', () => {
  const albums = ref([]);
  const albumPhotoList = ref(new Map());
  const albumPhotoImage = ref([]);

  const albumColorMap = ref(new Map()
  .set(-1, '#027CBC')
  .set(0, '#ED6060')
  .set(1, '#EDB45E')
  .set(2, '#63CF6D')
  .set(3, '#8482FF')
  .set(4, '#E17BF1'));

  async function getAlbums(sessionId) {
    const { data } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
      method: 'get',
      headers: { sessionId },
    })

    return data;
  }

  function setAlbums(data) {
    albums.value = data;
  }

  function updateAlbum(data) {
    const idx = albums.value.findIndex((item) => item.albumId === data.albumId);
    if (idx < 0) return;
    albums.value[idx] = data;
  }

  async function getAlbumData(id) {
    const userStore = useUserStore();
    const { fileData } = await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/albumdata`,
      method: 'get',
      headers: { sessionId: userStore.sessionId },
      params: {
        albumId: id
      }
    })
    albumPhotoList.value.set(id, fileData);
  }

  async function getAlbumPhoto(photoIdList) {
    const userStore = useUserStore();
    const { imageData } =  await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photo`,
      method: 'get',
      headers: { sessionId: userStore.sessionId },
      params: {
        photoName: photoIdList,
      },
    })
    photoIdList.forEach((id, idx) => {
      if (imageData[idx]) {
        albumPhotoImage.value.push({
          photoId: id,
          ...imageData[idx]
        })
      }
    })
  }

  async function editAlbum(data) {
    const userStore = useUserStore();
    return await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
      method: 'put',
      headers: { sessionId: userStore.sessionId },
      data
    });
  }

  async function deleteAlbumPhoto(data) {
    const userStore = useUserStore();
    await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/albums/photo`,
      method: 'delete',
      headers: { sessionId: userStore.sessionId },
      data,
    });
    const list = albumPhotoList.value.get(data.albumId);
    data.albumData.forEach((id) => {
      const idx = list.indexOf(id);
      if (idx >= 0) list.splice(idx, 1);
    })
    albumPhotoList.value.set(data.albumId, list);
  }

  function uploadAlbumPhoto(payload) {
    const { id, file } = payload;
    const list = albumPhotoList.value.get(id);
    if (list) {
      list.push(file);
    }
    albumPhotoList.value.set(id, list);
  }

  function updateAlbumPhoto(payload) {
    const { id, file, image, feature } = payload;
    const list = albumPhotoList.value.get(id);
    if (list) {
      const idx = list.findIndex((item) => item === file);
      if (idx < 0) {
        list.push(file);
        albumPhotoList.value.set(id, list);
      }
    }
    const idx = albumPhotoImage.value.findIndex((item) => item.photoId === file);
    if (idx < 0) {
      albumPhotoImage.value.push({
        photoId: file,
        base64Image: image,
        faceFeature: feature
      })
    }
  }

  return {
    albumColorMap,
    albums,
    albumPhotoList,
    albumPhotoImage,

    getAlbums,
    setAlbums,
    getAlbumData,
    getAlbumPhoto,

    updateAlbum,
    editAlbum,
    deleteAlbumPhoto,

    uploadAlbumPhoto,
    updateAlbumPhoto
  };
})