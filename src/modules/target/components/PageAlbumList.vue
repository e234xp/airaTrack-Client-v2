<template>
  <ProgressBarLayout>
    <FullLayout>
      <template #header>
        <NavigationBar />
      </template>

      <template #grow>
        <div class="mx-4 my-3">
          <div class="mb-4 flex justify-end">
            <template v-if="!isEditMode">
              <AppButton
                type="secondary"
                class="w-40 ml-6 py-2"
                @click="toggleEditMode"
              >
                {{ $t('Edit') }}
              </AppButton>
              <AppButton
                type="primary"
                class="w-40 ml-6 py-2"
                @click="handleToAddAlbum"
              >
                {{ $t('Add') }}
              </AppButton>
            </template>
            <template v-else>
              <AppButton
                type="secondary"
                class="w-40 ml-6 py-2"
                @click="toggleEditMode"
              >
                {{ $t('Cancel') }}
              </AppButton>
              <AppButton
                type="primary"
                class="w-40 ml-6 py-2"
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
import { storeToRefs } from 'pinia';

import spiderman from '@/spiderman';
import useUserStore from '@/stores/user';

import NavigationBar from '@/modules/target/components/NavigationBar.vue';
import SideBar from '@/modules/target/components/SideBar.vue';
import ModalAddAlbum from '@/modules/target/components/ModalAddAlbum.vue';
import useStore from '@/modules/target/stores/index';

const userStore = useUserStore();
const { sessionId } = storeToRefs(userStore);

const store = useStore();
const { setPage, setModal, setSelectedAlbum } = store;

const albums = ref([]);
onMounted(() => {
  getAlbums();
});

async function getAlbums() {
  ({ data: albums.value } = await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
    method: 'get',
    headers: { sessionId: sessionId.value },
  }));
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

  await spiderman.apiService({
    url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
    method: 'post',
    headers: { sessionId: sessionId.value },
    data: form,
  });

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
    await spiderman.apiService({
      url: `${spiderman.system.apiBaseUrl}/airaTracker/album`,
      method: 'delete',
      headers: { sessionId: sessionId.value },
      data: {
        albumId,
      },
    });

    return { result: 'ok' };
  }));

  await getAlbums();
}
</script>
