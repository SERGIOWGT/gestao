import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/Index'
import store from './store.js'
import vueMask from 'v-mask';
import GoogleSignInButton from 'vue-google-signin-button-directive'

Vue.use(vueMask);
Vue.config.productionTip = false


new Vue({
  vuetify,
  router,
  store,
  vueMask,
  GoogleSignInButton,
  render: h => h(App)
}).$mount('#app')
