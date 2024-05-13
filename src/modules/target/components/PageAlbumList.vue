<template>
  <ProgressBarLayout>
    <FullLayout style="width: max(83%, calc(100% - 20rem))">
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="relative h-full m-4 flex items-center justify-center gap-4">
          <AppButton
            type="secondary"
            class="absolute top-0 right-0 w-32"
            @click="onUpload"
          >
            {{ $t("Upload") }}
          </AppButton>
          <div class="album h-2/3 p-5 bg-black/40 rounded-lg border-2 border-panel cursor-pointer shadow-cus flex flex-col gap-2"
            :style="cardStyle"
            @click="onRead(album.id)"
            v-for="(album, idx) in albumsList" :key="album.id">
            <div class="text-white text-2xl truncate">{{ album.name }}</div>
            <div class="flex items-center gap-2 mb-2">
              <div class="w-4/5 h-3" :style="{ background: albumColorMap.get(idx) }"></div>
              <div class="w-1/5 text-center rounded-2xl text-black/80" :style="{ background: albumColorMap.get(idx) }">
                {{ getImageCount(album.id) }}
              </div>
            </div>
            <div class="w-full relative mb-2" 
              :class="[getImageList(album.id).length === 0 ? 'bg-black/20' : 'bg-black/40']"
              style="padding-top: 100%;" ref="albumImage">
              <div class="absolute top-0 left-0 w-full h-full flex flex-wrap">
                <AppSvgIcon
                  name="icon-images"
                  class="w-2/3 h-2/3 m-auto opacity-80"
                  v-if="getImageList(album.id).length === 0"
                />
                <template v-if="getImageList(album.id).length === 1">
                  <img :src="spiderman.base64Image.getSrc(getImage(getImageList(album.id)[0]))" class="w-full h-full object-cover">
                </template>
                <template v-if="getImageList(album.id).length > 1">
                  <img :src="spiderman.base64Image.getSrc(getImage(photo))" 
                    class="w-1/2 h-1/2 object-cover"
                    v-for="photo in getImageList(album.id)">
                </template>
              </div>
            </div>
            <div class="h-3 text-white/50 break-words" :style="{ width: `${albumWidth}px` }">{{ album.text }}</div>
            <div class="button mt-auto gap-4 hidden">
              <AppButton
                type="secondary"
                class="w-1/2"
                @click.stop="onEdit(album.id)"
              >
                {{ $t("Edit") }}
              </AppButton>
              <AppButton
                type="secondary"
                class="w-1/2"
                @click.stop="onRead(album.id)"
              >
                {{ $t("Detail") }}
              </AppButton>
            </div>
          </div>
        </div>
      </template>
    </FullLayout>

    <SideBar />
  </ProgressBarLayout>

  <ModalEditAlbum 
    v-model:modalName="editAlbumForm.albumName"
    v-model:modalDescription="editAlbumForm.description"
    @edit="handleEditAlbum"/>

  <ModalUpload @add="handleUploadAlbum" :list="albums" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed, onUnmounted } from 'vue';
import spiderman from '@/spiderman';
import { storeToRefs } from 'pinia';

import useStore from '@/modules/target/stores/index';
import useAlbums from '@/stores/albums';
import successStore from '@/components/AppSuccess/success';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import ModalEditAlbum from '@/modules/target/components/ModalEditAlbum.vue';
import ModalUpload from '@/modules/target/components/ModalUpload.vue';

const store = useStore();
const { setPage, setModal, setSelectedAlbumDetail } = store;

const albumsStore = useAlbums();
const { albums, albumPhotoList, albumPhotoImage, albumColorMap } = storeToRefs(albumsStore);
const { getAlbumData, getAlbumPhoto, editAlbum, updateAlbum, uploadAlbumPhoto } = useAlbums();

const editAlbumForm = ref({
  albumId: '',
  albumName: '',
  description: ''
});
const imageList = ref(new Map());
const albumImage = ref(null);
const albumWidth = ref(0);
const cardWidth = ref(0);

const cardStyle = computed({
  get: () => {
    return cardWidth.value !== 0 ? {
      width: `${cardWidth.value}px`
    } : {}
  }
})

const albumsList = computed({
  get: () => {
    return albums.value.map(({ albumId, albumName, description }) => ({ id: albumId, name: albumName, text: description }));
  }
})

function getImage(id) {
  return albumPhotoImage.value.find((item) => item.photoId === id)?.base64Image || '';
}

function getImageList(id) {
  return (albumPhotoList.value.get(id) || []).slice(0, 4).filter((id) => albumPhotoImage.value.findIndex((img) => img.photoId === id) >= 0);
}

function getImageCount(id) {
  return albumPhotoList.value.get(id)?.length;
}

function onEdit(id) {
  const album = albums.value.find((item) => item.albumId === id);
  if (album) {
    editAlbumForm.value = JSON.parse(JSON.stringify(album));
    setModal('edit-album');
  }
}

function onRead(id) {
  const album = albums.value.find((item) => item.albumId === id);
  if (album) {
    setSelectedAlbumDetail(album);
    setPage('album-detail');
  }
}

async function handleEditAlbum() {
  const result = await editAlbum(editAlbumForm.value);
  if (result) {
    updateAlbum(editAlbumForm.value);
    successStore.show();
    setModal('');
  }
}

function onUpload() {
  setModal('upload');
}

async function handleUploadAlbum(payload) {
  await getAlbumPhoto([payload.file]);
  await uploadAlbumPhoto(payload);
  // await refreshList(payload.id);
}

// async function refreshList(albumId) {
//   const list = albumPhotoList.value.get(albumId).slice(0, 4);
//   const filter = list.filter((id) => albumPhotoImage.value.findIndex((img) => img.photoId === id) < 0);
//   if (filter.length !== 0) await getAlbumPhoto(filter);
//   imageList.value.set(albumId, list);
// }

function handleResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;
  if (ratio > 2) {
    cardWidth.value = (height * 1.6) / 5;
  } else cardWidth.value = 0;
}

const containerObserver = new ResizeObserver(() => {
  albumWidth.value = albumImage.value[0].clientWidth;
})

onMounted(async () => {
  handleResize();
  window.addEventListener('resize', handleResize);
  containerObserver.observe(albumImage.value[0]);
  await Promise.allSettled(albums.value.map(async (item) => {
    await getAlbumData(item.albumId);
    // refreshList(item.albumId);
    const list = albumPhotoList.value.get(item.albumId).slice(0, 4);
    const filter = list.filter((id) => albumPhotoImage.value.findIndex((img) => img.photoId === id) < 0);
    if (filter.length !== 0) await getAlbumPhoto(filter);
  }));
})

onBeforeUnmount(() => {
  containerObserver.unobserve(albumImage.value[0]);
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss">
.album {
  width: calc(20% - 1.25rem);
}

.album:hover .button {
  display: flex;
}
</style>