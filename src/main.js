import { createApp } from 'vue';
import { createPinia } from 'pinia';
import 'virtual:svg-icons-register';

import './assets/scss/main.scss';

import print from 'vue3-print-nb';
import * as globalComponents from './components/app';
import * as Layouts from './layouts/index';

import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n';

const app = createApp(App);

// 引入global components
Object.entries(globalComponents).forEach(([key, value]) => {
  app.component(key, value);
});

// 引入 layouts
Object.entries(Layouts).forEach(([key, value]) => {
  app.component(key, value);
});

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(print)
  .mount('#app');
