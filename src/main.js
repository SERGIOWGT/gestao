import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/Index'
import store from './store.js'
import VueMask  from 'v-mask';
import GoogleSignInButton from 'vue-google-signin-button-directive'
import {TheMask} from 'vue-the-mask'

import CountryFlag from 'vue-country-flag'
Vue.component('country-flag', CountryFlag)

Vue.use(VueMask);
Vue.use(TheMask);
Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  GoogleSignInButton,
  render: h => h(App)
}).$mount('#app')
