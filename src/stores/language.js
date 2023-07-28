import { ref, watch } from 'vue';
import { defineStore } from 'pinia';
import spiderman from '@/spiderman';

import { useI18n } from 'vue-i18n';

const LOCAL_STORAGE_KEY = 'language';

export default defineStore('language', () => {
  const language = ref(getLanguage());
  function getLanguage() {
    const defaultLanguage = 'en';
    const stored = spiderman.localStorage.get(LOCAL_STORAGE_KEY);

    return stored ?? defaultLanguage;
  }

  const i18n = useI18n();
  watch(language, (value) => {
    i18n.locale.value = value;
    spiderman.localStorage.set(LOCAL_STORAGE_KEY, value);
  });

  return { language };
});
