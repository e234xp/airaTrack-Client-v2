<template>
  <!-- total: 92px -->
  <!-- 28px + 8px -->
  <div class="px-8 py-2 text-xl mb-1 bg-primary-hover text-white font-bold">{{ title }} {{ $t('InvestigationReport') }}</div>
  <!-- 48px + 8px -->
  <div class="mb-4 px-8 py-2 flex justify-between items-center border-b-2 border-modal/40">
    <!-- 32px -->
    <div class="text-2xl">
      {{ title }}
    </div>
    <!-- 48px -->
    <div class="text-general text-base text-right">
      <div>{{ username }}</div>
      <div>
        {{ `${spiderman.formatDate.parseYMD(timestamp)} ${spiderman.dayjs(timestamp).format('HH:mm')}` }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import spiderman from '@/spiderman';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  username: {
    type: String,
    default: '',
  },
  timestamp: {
    type: Number,
    default: 0,
  }
});

const title = computed(() => {
  return document.title.split(' ')[0];
})
</script>

<style scoped>

</style>
