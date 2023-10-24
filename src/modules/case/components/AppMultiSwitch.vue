<template>
  <div class="flex items-center bg-gray-900 bg-opacity-60 rounded-full text-white text-base">
    <div class="rounded-full px-6 h-full py-2 cursor-pointer"
      :class="[item.value === value ? 'bg-gray-600 shadow-lg' : '']" @click="$emit('select', item.value)"
      v-for="(item, idx) in list" :key="idx">{{ item.text }}</div>
  </div>
</template>

<script setup>
defineProps({
  value: {
    type: String,
    default: ''
  },
  list: {
    type: Array,
    default: [],
  }
});

defineEmits(['select']);
</script>