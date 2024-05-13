import { createI18n } from 'vue-i18n';

import en from './en.json';
import zh from './zh.json';
import ja from './jp.json';
import id from './id.json';
import vi from './vi.json';

const locale = (() => {
  const storedLanguageString = window.localStorage.getItem('language');
  const storedLanguage = JSON.parse(storedLanguageString);

  return storedLanguage ?? 'en';
})();

const messages = {
  zh,
  en,
  ja,
  id,
  vi
};

const i18n = createI18n({
  locale,
  legacy: false,
  messages,
  missing: (l, key) => `!${key}`,
});

export default i18n;
