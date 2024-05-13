<template>
  <div class="relative w-full h-full" ref="panel">
    <table class="w-full table text-white mt-4">
      <thead>
        <tr>
          <th :width="col.width" :class="`text-${col.align || 'left'}`" v-for="(col, idx) in columns" :key="idx">
            {{ col.text }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="data in pageData">
          <td :class="`text-${col.align || 'left'}`" v-for="col in columns">
            <slot :name="col.key" :data="data">{{ data[col.key] }}</slot>
          </td>
        </tr>
      </tbody>
    </table>
    <AppPagination :currentPage="pagination.current" :perPage="pagination.perItems" :totalItems="pagination.total"
      @onTurnPage="onTurnPage" class="text-center absolute w-full bottom-4">
    </AppPagination>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';

const prop = defineProps({
  columns: {
    type: Array,
    default: () => []
  },
  dataList: {
    type: Array,
    default: () => []
  },
  rowHeight: {
    type: Number,
    default: 70
  },
  margin: {
    type: Number,
    default: 56
  }
});

const pageData = computed({
  get: () => { 
    return prop.dataList.slice((pagination.current - 1) * pagination.perItems, pagination.current * pagination.perItems);
  }
})

const pagination = reactive({
  current: 1,
  perItems: 0,
  total: computed(() => {
    return prop.dataList.length;
  }),
  pages: computed(() => {
    const temp = Math.ceil(pagination.total / pagination.perItems);
    if (temp < pagination.current) pagination.current = temp;
    return temp;
  })
})

function onTurnPage(val) {
  pagination.current = val;
}

function sizeAdjust() {
  const height = panel.value.clientHeight;
  pagination.perItems = Math.floor((height - prop.margin) / prop.rowHeight);
  if (pagination.pages < pagination.current) pagination.current = pagination.pages;
}

const panel = ref(null);       // DOM ref

const containerObserver = new ResizeObserver(() => {
  sizeAdjust();
})

onMounted(async () => {
  containerObserver.observe(panel.value);
})

onBeforeUnmount(() => {
  containerObserver.unobserve(panel.value);
})
</script>

<style></style>