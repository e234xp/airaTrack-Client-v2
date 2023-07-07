import './assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import SvgIcon from '@/components/SvgIcon.vue';

import i18n from './plugins/i18n';
import App from './App.vue';
import router from './router';

import 'virtual:svg-icons-register';

const app = createApp(App);
app.component('SvgIcon', SvgIcon);

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app');
