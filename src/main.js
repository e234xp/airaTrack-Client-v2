import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueLazyload from 'vue-lazyload'
import 'virtual:svg-icons-register';

import './assets/scss/main.scss';

import print from 'vue3-print-nb';
import * as globalComponents from './components/app';
import * as Layouts from './layouts/index';

import App from './App.vue';
import router from './router';
import i18n from './plugins/i18n';
// import { createVuetify } from 'vuetify';
// import 'vuetify/styles';  // 引入 Vuetify 樣式
// import '@mdi/font/css/materialdesignicons.css';  // 引入 Material Design Icons
// import { aliases, mdi } from 'vuetify/iconsets/mdi';
// import * as components from 'vuetify/components';
// import * as directives from 'vuetify/directives';

// const vuetify = createVuetify({
//   components, 
//   directives, 
//   icons: {
//     defaultSet: 'mdi',
//     aliases,
//     sets: { mdi },
//   },
// });
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
  .use(VueLazyload)
  // .use(vuetify)
  .mount('#app');
