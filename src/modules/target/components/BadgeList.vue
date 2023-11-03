<template>
  <div class="flex items-center gap-2 badge-list" style="width: calc(100% - 13rem)">
    <div class="flex justify-between items-center w-3/5 bg-third rounded-2xl pl-2 pr-2 h-8" v-for="item in filter">
      <div class="badge-list bg-gradient-to-r from-white to-third bg-clip-text 
        text-transparent overflow-hidden whitespace-nowrap text-base leading-4 w-full">{{ item.name }}</div>
      <div class="bg-black w-4 h-4 mb-0.5">
        <AppButton type="secondary" :isEnable="selected.length > 1" class="h-full w-full rounded" @click="onUnSelected(item.id)">
          <AppSvgIcon name="icon-close" class="text-white w-8 h-8" :class="{ 'opacity-40': selected.length === 1 }" />
        </AppButton>
      </div>
    </div>
    <!-- <div class="bg-third rounded-2xl px-2 py-1 w-10 h-8 text-center select-none" v-if="selected.length > filter.length">
      +{{ selected.length - filter.length }}
    </div> -->
    <div class="relative bg-secondary w-5 h-5 p-0.5 rounded-md hover:bg-primary-hover" @mouseenter="onOpen" @mouseleave="onOpen">
      <AppSvgIcon name="icon-chevron-botton" class="text-white w-4 h-4"/>
      <div class="absolute -top-2 left-5 pl-2 z-10" v-if="isOpen">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

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
    type: Number,
    default: 1,
  },
});

const emit = defineEmits([
  'update:unSelectCamera'
]);


const isOpen = ref(false);

const filter = computed({
  get: () => {
    return props.selected.slice(0, props.limit).map((id) => (props.list.find((item) => item.id === id) || {}))
  }
})

function onOpen() {
  isOpen.value = !isOpen.value;
}

function onUnSelected(id) {
  emit('update:unSelectCamera', id);
}

</script>

<style>
.badge-list {
  --tw-gradient-from-position: 80% !important;
}
</style>