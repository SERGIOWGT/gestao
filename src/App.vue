<template>
  <v-app>
    <v-main>
      <AppBar
        :titulo="titulo"
        :urlLogo="urlLogo"
      />
      <v-container fluid style="max-width: 600px;height: 100vh;" >
        <Router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import AppBar from './components/AppBar';

export default {
  name: 'App', 

  components: {
    AppBar
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
