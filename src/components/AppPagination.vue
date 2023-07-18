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
        <span class="">&lt;</span>
      </a>
      <a
        v-for="page in totalPages"
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
        <span class="">&gt;</span>
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
});

defineEmits(['onTurnPage']);
const totalPages = computed(() => Math.ceil(props.totalItems / props.perPage));
</script>
