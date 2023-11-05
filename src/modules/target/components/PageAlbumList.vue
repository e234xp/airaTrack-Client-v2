<template>
  <ProgressBarLayout>
    <FullLayout style="width: calc(100% - 20rem)">
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="h-full mx-4 my-4 flex items-center justify-center gap-4">
          <div class="album h-2/3 p-5 bg-black/40 rounded-lg border-2 border-panel shadow-cus flex flex-col gap-5"
            style="width: calc(20% - 1.25rem)"
            v-for="(album, idx) in albumsList" :key="album.id">
            <div class="text-white text-2xl">{{ album.name }}</div>
            <div class="w-full h-3 bg-album-1" :style="{ background: albumColorMap.get(idx) }"></div>
            <div class="w-full bg-black/40 relative" style="padding-top: 100%;" ref="albumImage">
              <div class="absolute top-0 left-0 w-full h-full flex flex-wrap">
                <AppSvgIcon
                  name="icon-images"
                  class="w-2/3 h-2/3 m-auto"
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
            <div class="h-3 text-white break-words" :style="{ width: `${albumWidth}px` }">{{ album.text }}</div>
            <div class="button mt-auto gap-4 hidden">
              <AppButton
                type="secondary"
                class="w-1/2"
                @click="onEdit(album.id)"
              >
                {{ $t("Edit") }}
              </AppButton>
              <AppButton
                type="secondary"
                class="w-1/2"
                @click="onRead(album.id)"
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
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
import spiderman from '@/spiderman';
import { storeToRefs } from 'pinia';
import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import ModalEditAlbum from '@/modules/target/components/ModalEditAlbum.vue';
import useStore from '@/modules/target/stores/index';
import useAlbums from '@/stores/albums';
import successStore from '@/components/AppSuccess/success';

const store = useStore();
const { setPage, setModal, setSelectedAlbumDetail } = store;

const albumsStore = useAlbums();
const { albums, albumPhotoList, albumPhotoImage, albumColorMap } = storeToRefs(albumsStore);
const { getAlbumData, getAlbumPhoto, editAlbum, updateAlbum } = useAlbums();

const editAlbumForm = ref({
  albumId: '',
  albumName: '',
  description: ''
});
const imageList = ref(new Map());
const albumImage = ref(null);
const albumWidth = ref(0);

const albumsList = computed({
  get: () => {
    return albums.value.map(({ albumId, albumName, description }) => ({ id: albumId, name: albumName, text: description }));
  }
})

function getImage(id) {
  return albumPhotoImage.value.find((item) => item.photoId === id).base64Image || '';
}

function getImageList(id) {
  return imageList.value.get(id) || [];
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

const containerObserver = new ResizeObserver(() => {
  albumWidth.value = albumImage.value[0].clientWidth;
})

onMounted(async () => {
  containerObserver.observe(albumImage.value[0]);
  await Promise.allSettled(albums.value.map(async (item) => {
    await getAlbumData(item.albumId);
    const list = albumPhotoList.value.get(item.albumId).slice(0, 4);
    const filter = list.filter((id) => albumPhotoImage.value.findIndex((img) => img.photoId === id) < 0);
    if (filter.length !== 0) await getAlbumPhoto(filter);
    imageList.value.set(item.albumId, list);
  }));
})

onBeforeUnmount(() => {
  containerObserver.unobserve(albumImage.value[0]);
})
</script>

<style lang="scss">
.album:hover .button {
  display: flex;
}
</style>