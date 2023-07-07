import './assets/scss/main.scss';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import * as globalComponents from './components/global/index';

import i18n from './plugins/i18n';
import App from './App.vue';
import router from './router';

import 'virtual:svg-icons-register';

const app = createApp(App);

// 引入global components
Object.entries(globalComponents).forEach(([key, value]) => {
  app.component(key, value);
});

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app');
