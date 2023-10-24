<template>
  <div class="flex items-center gap-2 badge-list" style="width: calc(100% - 13rem)">
    <div class="flex justify-between items-center w-1/4 bg-secondary rounded-2xl pl-2 pr-2 h-8" v-for="item in filter">
      <div class="badge-list bg-gradient-to-r from-white to-secondary bg-clip-text 
        text-transparent overflow-hidden whitespace-nowrap text-base leading-4 w-full">{{ item.text }}</div>
      <div class="bg-black w-4 h-4 mb-0.5">
        <AppButton type="secondary" class="h-full w-full rounded">
          <AppSvgIcon name="icon-close" class="text-white w-8 h-8" />
        </AppButton>
      </div>
    </div>
    <div class="bg-secondary rounded-2xl px-2 py-1 w-12 h-8" v-if="list.length > filter.length">
      +{{ list.length - filter.length }}
    </div>
    <div class="bg-black w-5 h-5 p-0.5 rounded-md">
      <AppSvgIcon name="icon-chevron-botton" class="text-white w-4 h-4" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  list: {
    type: Array,
    default: [],
  },
  limit: {
    type: Number,
    default: 0,
  },
});

const filter = computed({
  get: () => props.list.slice(0, props.limit)
})
</script>

<style>
.badge-list {
  --tw-gradient-from-position: 80% !important;
}
</style>