<template>
  <div class="bg-third max-w-xs p-4 flex flex-col gap-2 rounded-lg" style="max-height: 50vh; ">
    <div class="flex items-center gap-2" v-for="(item, idx) in list">
      <AppCheckBox :placeholder="item.name" :modelInput="isChecked(item.id)" :disabled="isChecked(item.id) && limit && selected.length === 1" @onChange="onCheck(item.id)">
        <div class="flex items-center gap-2">
          <div class="truncate">{{ item.name }}</div>
          <div class="w-4 h-4 rounded" :style="{ backgroundColor: getAlbumColor(idx) }" v-if="!limit"></div>
        </div>
      </AppCheckBox>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import useAlbums from '@/stores/albums';

const albumsStore = useAlbums();
const { albumColorMap } = storeToRefs(albumsStore);

const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
  selected: {
    type: Array,
    default: [],
  },
  limit: {
    type: Boolean,
    default: true,
  }
});

const emit = defineEmits([
  'update:selectCamera',
  'update:unSelectCamera'
]);

function getAlbumColor(val) {
  return albumColorMap.value.get(val);
}

function isChecked(id) {
  return props.selected.indexOf(id) >= 0;
}

function onCheck(id) {
  const idx = props.selected.indexOf(id);
  if (idx < 0) {
    emit('update:selectCamera', id);
  } else {
    if (props.selected.length === 1) return;
    emit('update:unSelectCamera', id);
  }
}
</script>

<style>
</style>