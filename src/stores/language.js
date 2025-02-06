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

  // console.log("1");

  async function languageList(cb) {
    // console.log("11");
    const files = import.meta.glob('/public/i18n/*.json');

    let langList = [];

    for (const f in files) {
      await new Promise((resolve) => {
        files[f]().then((l) => {
          // console.log("13", l['LanguageDisplay']);

          let fn = f.replaceAll('/public/i18n/', '');
          fn = fn.replaceAll('.json', '');
          // list[`${l['LanguageDisplay']}`] = fn ;
          langList.push({ code: fn, disp: l['LanguageDisplay'] });

          // console.log("14", l['LanguageDisplay']);
          resolve();
        });
      });
    }
    // console.log("12", langList);

    if (cb) cb(langList);
    return ;
  }

  return {
    language,
    languageList,
  };
});
