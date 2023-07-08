import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('system', () => {
  const version = ref('2.0.0');
  const apiBaseUrl = ref('http://192.168.10.162:8083');

  return { version, apiBaseUrl };
});
