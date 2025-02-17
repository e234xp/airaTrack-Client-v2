import { createI18n } from 'vue-i18n';

import en from '/public/i18n/en.json';
import es from '/public/i18n/es.json';
import fr from '/public/i18n/fr.json';
import id from '/public/i18n/id.json';
import ja from '/public/i18n/jp.json';
import ko from '/public/i18n/ko.json';
import th from '/public/i18n/th.json';
import vi from '/public/i18n/vi.json';
import zh from '/public/i18n/zh.json';


const locale = (() => {
  const storedLanguageString = window.localStorage.getItem('language');
  const storedLanguage = JSON.parse(storedLanguageString);

  return storedLanguage ?? 'en';
})();


// console.log("123123123132", en);
// console.log("123123123132", zh);

const messages = {
  en,
  es,
  fr,
  id,
  ja,
  ko,
  th,
  vi,
  zh
};

const i18n = createI18n({
  locale,
  legacy: false,
  messages,
  missing: (l, key) => `!${key}`,
});

export default i18n;
