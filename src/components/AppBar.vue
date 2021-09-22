<template>
    <v-app-bar
      app
      flat
      color="indigo darken-2"
      dark
    >
      <div class="d-flex align-center">
        <v-btn  icon v-on:click="goHome()">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
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
  import store from '../store'

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
        this.$router.push('/Home').catch(()=>{})
      },
      logout() {
        store.commit('logout')
        this.$router.push('/login')
      }
    }
  }
</script>
<style scoped>
.v-btn::before {
  background-color: transparent;
}
</style>