import { ref } from 'vue';
import { defineStore } from 'pinia';

export default defineStore('language', () => {
  const language = ref('zn');

  function changeLanguage(lang) {
    language.value = lang;
  }

  return { language, changeLanguage };
});
