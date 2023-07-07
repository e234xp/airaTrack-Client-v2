import { ref, watch, inject } from 'vue';
import { useI18n } from 'vue-i18n';

export default () => {
  const spiderman = inject('$spiderman');

  const language = ref('en');
  const i18n = useI18n();

  watch(language, async (lang) => {
    i18n.locale.value = lang;
    spiderman.localStorage.set('language', lang);
  });

  const storedLanguage = spiderman.localStorage.get('language');
  if (storedLanguage) {
    language.value = storedLanguage;
  }

  return {
    language,
  };
};
