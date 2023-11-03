import { defineStore } from 'pinia';
import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

export default defineStore('module-upload-mobile', () => {
  async function uploadPhoto(image, albumId) {
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

  return {
    uploadPhoto
  }
})