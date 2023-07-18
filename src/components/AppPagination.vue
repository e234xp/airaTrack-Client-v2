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
      >
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M5 1 1 5l4 4"
          />
        </svg>

      </a>
      <a
        v-for="page in displayPages"
        :key="page"
        @click="$emit('onTurnPage', page)"
        href="#"
        class="relative inline-flex items-center
        px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
        :class="{
          'bg-primary text-white': page === currentPage,
          'text-gray-900': page !== currentPage,
        }"
      >
        {{ page }}
      </a>
      <a
        @click="$emit('onTurnPage', currentPage + 1)"
        href="#"
        class="relative inline-flex items-center rounded-r-md
        px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
      >
        <svg
          class="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 6 10"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="m1 9 4-4-4-4"
          />
        </svg>
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
