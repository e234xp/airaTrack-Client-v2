<template>
  <PageWall v-if="page === 'wall'" />
</template>

<script setup>
import { ref } from 'vue';
import PageWall from '@/modules/target/components/PageWall.vue';

const page = ref('wall');
</script>
