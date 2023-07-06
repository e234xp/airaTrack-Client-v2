import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import i18n from './plugins/i18n';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app
  .use(createPinia())
  .use(router)
  .use(i18n)
  .mount('#app');
