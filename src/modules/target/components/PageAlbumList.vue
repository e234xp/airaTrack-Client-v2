<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="mx-4 my-4">
          <div class="mb-4 flex justify-end gap-4">
            <template v-if="!isEditMode">
              <AppButton
                type="secondary"
                class="w-40"
                @click="toggleEditMode"
              >
                {{ $t('Edit') }}
              </AppButton>
              <AppButton
                type="primary"
                class="w-40"
                @click="handleToAddAlbum"
              >
                {{ $t('Add') }}
              </AppButton>
            </template>
            <template v-else>
              <AppButton
                type="secondary"
                class="w-40"
                @click="toggleEditMode"
              >
                {{ $t('Cancel') }}
              </AppButton>
              <AppButton
                type="danger"
                class="w-40"
                :is-enable="selectedAlbums.length>0"
                @click="handleDelete"
              >
                {{ $t('Delete') }}
              </AppButton>
            </template>
          </div>
          <div class="aira-row-auto-3">
            <div
              v-for="album in albums"
              :key="album.albumId"
              class="mb-4 flex flex-col justify-self-center cursor-pointer relative"
            >
              <AppSvgIcon
                v-if="album.albumName === 'Upload Photo'"
                name="icon-folder-upload"
                class="w-32 h-32"
                @click="handleToDetail(album)"
              />
              <AppSvgIcon
                v-else-if="!isEditMode"
                name="icon-folder"
                class="w-32 h-32"
                @click="handleToDetail(album)"
              />
              <template
                v-else
              >
                <AppSvgIcon
                  name="icon-folder"
                  class="w-32 h-32"
                  @click="selectAlbum(album)"
                />
                <AppCheckBox
                  :checked="findAlbumIndex(album) !== -1"
                  class="absolute bottom-14 right-2"
                />
              </template>
              <div class="text-center text-white">
                {{ album.albumName }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </FullLayout>

    <SideBar />
  </ProgressBarLayout>

  <ModalAddAlbum
    @add="handleAddAlbum"
  />
</template>

<script setup>
import { onMounted, ref } from 'vue';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import ModalAddAlbum from '@/modules/target/components/ModalAddAlbum.vue';
import useStore from '@/modules/target/stores/index';

const store = useStore();
const { setPage, setModal, setSelectedAlbum, getAlbum, addAlbum, deleteAlbum } = store;

const albums = ref([]);
onMounted(() => {
  getAlbums();
});

async function getAlbums() {
  ({ data: albums.value } = await getAlbum());
}

function handleToDetail(album) {
  setSelectedAlbum(album);
  setPage('album-detail');
}

function handleToAddAlbum() {
  setModal('add-album');
}

async function handleAddAlbum(form) {
  if (!form.albumName) return;

  await addAlbum(form);

  await getAlbums();

  setModal('');
}

const selectedAlbums = ref([]);
function selectAlbum(album) {
  const index = findAlbumIndex(album);
  if (index === -1) {
    selectedAlbums.value.push(album);
    return;
  }
  selectedAlbums.value.splice(index, 1);
}

function findAlbumIndex(album) {
  return selectedAlbums.value
    .findIndex((selectedAlbum) => selectedAlbum.albumId === album.albumId);
}

const isEditMode = ref(false);
function toggleEditMode() {
  isEditMode.value = !isEditMode.value;
  selectedAlbums.value = [];
}

async function handleDelete() {
  await Promise.allSettled(selectedAlbums.value.map(async ({ albumId }) => {
    await deleteAlbum(albumId);

    return { result: 'ok' };
  }));

  await getAlbums();
}
</script>
