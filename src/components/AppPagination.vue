<template>
  <div>
    <nav
      class="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white"
    >
      <a
        @click="$emit('onTurnPage', currentPage - 1)"
        href="#"
        class="relative inline-flex items-center rounded-l-md
        px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
        :class="{
          'pointer-events-none': currentPage === 1,
          'opacity-50 cursor-not-allowed': currentPage === 1
        }"
        :disabled="currentPage === 1"
      >
        <AppSvgIcon
          name="icon-chevron-left"
          class="w-3 h-3"
        />
      </a>

      <a
        v-for="page in displayPages"
        :key="page"
        @click="$emit('onTurnPage', page)"
        href="#"
        :class="{
          'bg-primary text-white': page === currentPage,
          'text-gray-900': page !== currentPage,
        }"
        class="relative inline-flex items-center
        px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
      >
        {{ page }}
      </a>
      <a
        @click="$emit('onTurnPage', currentPage + 1)"
        href="#"
        :class="{
          'pointer-events-none': currentPage === totalPages,
          'opacity-50 cursor-not-allowed': currentPage === totalPages
        }"
        :disabled="currentPage === totalPages"
        class="relative inline-flex items-center rounded-r-md
        px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
      >
        <AppSvgIcon
          name="icon-chevron-right"
          class="w-3 h-3"
        />
      </a>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 0,
  },
  perPage: {
    type: Number,
    default: 24,
  },
  totalItems: {
    type: Number,
    default: 0,
  },
  maxDisplayPages: {
    type: Number,
    default: 11,
  },
});

defineEmits(['onTurnPage']);

const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));

const displayPages = computed(() => {
  const result = [];
  const { currentPage, maxDisplayPages } = props;

  // 總頁數少於或等於最多顯示頁數時，顯示全部頁數
  if (totalPages.value <= maxDisplayPages) {
    for (let page = 1; page <= totalPages.value; page += 1) {
      result.push(page);
    }

    return result;
  }

  let startPage;
  let endPage;

  // 當前頁面在中間時
  if (currentPage <= Math.ceil(maxDisplayPages / 2)) {
    startPage = 1;
    endPage = maxDisplayPages;
  } else if (currentPage > totalPages.value - Math.floor(maxDisplayPages / 2)) {
    // 當前頁面在最後幾頁時
    startPage = totalPages.value - maxDisplayPages + 1;
    endPage = totalPages.value;
  } else {
    // 當前頁面在中間頁面時
    startPage = currentPage - Math.floor(maxDisplayPages / 2);
    endPage = currentPage + Math.floor(maxDisplayPages / 2);
  }

  for (let page = startPage; page <= endPage; page += 1) {
    result.push(page);
  }

  return result;
});

</script>
