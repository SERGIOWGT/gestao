<template>
<v-app>
 <AppBar
    v-if="$store.getters.estaLogado"
    :titulo="$store.getters.nomeSistema"
    :urlLogo="urlLogo"
  />
  
  <v-main>
     <v-container fill-height fluid style="max-width: 600px;" class="pa-0">
       <UserBar
        v-if="$store.getters.estaLogado"
       />
       <Router-view/>
    </v-container>
  </v-main>
</v-app>
</template>

<script>
import AppBar from './components/AppBar';
import UserBar from './components/UserBar';

export default {
  name: 'App', 

  components: {
    AppBar, UserBar
  }, 

  data(){
    return {
      titulo: 'Painel Saúde',
      urlLogo: 'https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png'
    }
  }
};
</script>

<style scoped>

</style>
