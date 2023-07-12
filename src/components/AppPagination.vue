<template>
  <div>
    <nav
      class="isolate inline-flex -space-x-px rounded-md shadow-sm bg-white"
    >
      <a
        href="#"
        class="relative inline-flex items-center rounded-l-md
        px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
      >
        <span class="">&lt;</span>
      </a>
      <a
        v-for="i in 5"
        :key="i"
        href="#"
        class="relative inline-flex items-center
        px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300
        hover:bg-primary-hover hover:text-white focus:z-20 focus:outline-offset-0"
        :class="{
          'bg-primary text-white': i === 1,
          'text-gray-900': i !== 1,
        }"
      >
        {{ i }}
      </a>
      <a
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
defineProps({
  setting: {
    type: Object,
    default() {
      return {};
    },
  },
  showingPageNumbers: {
    type: Array,
    default() {
      return [];
    },
  },
});

defineEmits(['turnPage']);
</script>
