<template>
   <v-app>
    <v-container fill-height grid-list-md class="pa-0" style="max-width: 600px;">
      <v-layout row wrap justify-center>
        <AppBar v-if="$store.getters.estaAutenticadoApi" :titulo="$store.getters.nomeSistema" :urlLogo="urlLogo"/>
        <v-main>
            <UserBar v-if="$store.getters.estaAutenticadoApi"/>
            <transition appear name="slide" mode="out-in">
              <Router-view/>
            </transition>
      </v-main>
      </v-layout>
      </v-container>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';
import UserBar from './components/UserBar';

export default {
  name: 'App', 
  components: { AppBar, UserBar}, 
  data(){
    return {
      titulo: 'Painel Saúde',
      urlLogo: 'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
    }
  }
};
</script>
<style scoped>
  .slide-leave-active{
    transition: 0s;
  }
  .slide-enter-active {
    transition: 0.3s;
  }
  .slide-enter {
    transform: translate(100%, 0);
  }
  .slide-leave-to {
    transform: translate(-100%, 0);
  }
  .v-app {
    max-width:600px;
    margin: 0 auto;
  }
</style>
