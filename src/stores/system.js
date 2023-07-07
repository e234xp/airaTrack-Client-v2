import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('system', () => {
  const version = ref('2.0.0');

  return { version };
});
