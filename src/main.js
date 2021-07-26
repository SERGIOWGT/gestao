import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/Index'
import store from './store.js'
import GoogleSignInButton from 'vue-google-signin-button-directive'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  GoogleSignInButton,
  render: h => h(App)
}).$mount('#app')
