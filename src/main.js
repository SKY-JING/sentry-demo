import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'lib-flexible/flexible';
import '&/css/reset.css';

import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

// if (process.env.NODE_ENV === 'production') {
// }

Sentry.init({
  dsn: 'https://c62ad01e9fa04a588a0604de805eadff@o386931.ingest.sentry.io/5221734',
  integrations: [new Integrations.Vue({ Vue, attachProps: true }), new Integrations.RewriteFrames()],
  logErrors: true,
  release: process.env.RELEASE_VERSION
});
/* eslint-disable */
console.log(dd.abc); // 测试

if (process.env.VUE_APP_SHOW_vConsole === 'true') {
  const Vconsole = require('vconsole');
  // eslint-disable-next-line no-new
  new Vconsole();
}

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
