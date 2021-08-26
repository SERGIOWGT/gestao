<template>
    <v-app-bar
      app
      flat
      color="indigo darken-2"
      dark
    >
      <div class="d-flex align-center">
        <a href="/Home">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          :src="urlLogo"
          transition="scale-transition"
          width="40"
        >
        </v-img>
        </A>
      </div>
      <v-spacer>
      <div class="text-center"><h4>{{titulo}}</h4></div>
      </v-spacer> 
      <v-btn  icon v-on:click="logout()">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
</template>
<script>
  export default {
    name: 'AppBar',
    props: {
      titulo: String, urlLogo: String
    },
    data() {
      return {
        selectedItem: 1,
        items: [
          { text: 'Real-Time', icon: 'mdi-clock' },
          { text: 'Audience', icon: 'mdi-account' },
          { text: 'Conversions', icon: 'mdi-flag' },
        ],
      }
    },
    methods: { 
      goHome() {
        this.$router.push('/Home');
      },
      logout() {
        this.$router.push('/Home');
        //this.$store.commit('logout')
        //this.$router.push('/')
      }
    }
  }
</script>
<style scoped>
.v-btn::before {
  background-color: transparent;
}
</style>