import { createI18n } from 'vue-i18n';

import en from './en.json';
import zh from './zh.json';
import ja from './jp.json';

const locale = (() => {
  const storedLanguageString = window.localStorage.getItem('language');
  const storedLanguage = JSON.parse(storedLanguageString);

  return storedLanguage ?? 'en';
})();

const messages = {
  zh,
  en,
  ja,
};

const i18n = createI18n({
  locale,
  legacy: false,
  messages,
  missing: (l, key) => `!${key}`,
});

export default i18n;
