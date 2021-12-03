import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/Index'
import store from './store.js'
import VueMask  from 'v-mask';
import {TheMask} from 'vue-the-mask'
import wb from "./registerServiceWork";

Vue.prototype.$workbox = wb;
Vue.use(VueMask);
Vue.use(TheMask);
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
