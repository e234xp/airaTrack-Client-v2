import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('module-target', () => {
  const selectedFace = ref(123);

  function setSelectedFace(data) {
    selectedFace.value = data;
  }

  return {
    selectedFace,
    setSelectedFace,
  };
});
