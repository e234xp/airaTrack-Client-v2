<template>
  <ModalLayout
    :is-open="modal === 'album-filter'"
    @close="handleClose"
  >
    <template #header>
      {{ $t('AlbumFilter') }}
    </template>

    <template #description>
      {{ $t('AlbumFilterDialog') }}
    </template>

    <template #default>
      <div class="bg-third p-4 w-full flex flex-col gap-2 rounded-lg">
        <div class="flex items-center gap-2" v-for="(item, idx) in list">
          <AppCheckBox :placeholder="item.name" :modelInput="isChecked(item.id)" @onChange="onCheck(item.id)">
            <div class="flex items-center gap-2">
              <AppSvgIcon name="icon-album" class="w-6 h-6" :color="getAlbumColor(idx)" />
              <!-- <div class="w-4 h-4 rounded" :style="{ backgroundColor: getAlbumColor(idx) }"></div> -->
              <div class="truncate" :style="{color: getAlbumColor(idx)}">{{ item.name }}</div>
            </div>
          </AppCheckBox>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-4">
        <AppButton
          type="secondary"
          class="px-6"
          @click="handleClose"
        >
          {{ $t('Cancel') }}
        </AppButton>

        <AppButton
          type="primary"
          class="px-6"
          @click="handleFilter"
        >
          {{ $t('Save') }}
        </AppButton>
      </div>
    </template>
  </ModalLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import useStore from '@/modules/target/stores/index';
import useAlbums from '@/stores/albums';

const albumsStore = useAlbums();
const { albumColorMap } = storeToRefs(albumsStore);

const props = defineProps({
  selected: {
    type: Array,
    default: []
  },
  list: {
    type: Array,
    default: []
  }
});

const emit = defineEmits(['filter']);

const store = useStore();
const { modal } = storeToRefs(store);
const { setModal } = store;

const temp = ref([]);

function isChecked(id) {
  return temp.value.indexOf(id) >= 0;
}

function onCheck(id) {
  const idx = temp.value.indexOf(id);
  if (idx < 0) {
    temp.value.push(id);
  } else {
    temp.value.splice(idx, 1);
  }
}

function getAlbumColor(val) {
  return albumColorMap.value.get(val - 1);
}

function handleClose() {
  temp.value = props.selected.map((item) => item);
  setModal('');
}

function handleFilter() {
  emit('filter', temp.value.map((id) => id));
  setModal('');
}

onMounted(() => {
  temp.value = props.selected.map((item) => item);
})
</script>
