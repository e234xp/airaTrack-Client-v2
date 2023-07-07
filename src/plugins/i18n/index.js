import { createI18n } from 'vue-i18n';

import en from './en.json';
import zh from './zh.json';
import ja from './jp.json';

// const locale = navigator.language;
const locale = 'zh';

const messages = {
  zh,
  en,
  ja,
};

const i18n = createI18n({
  locale,
  messages,
  formatter: {
    format: (message) => i18n.messages[i18n.locale][message],
  },
});

export default i18n;
