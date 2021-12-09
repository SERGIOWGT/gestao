<template>
    <v-app-bar app flat dark  color="teal darken-4" class="pr-2">
      <v-row class="linha">
        <v-col  class="d-flex justify-center" cols="1">
          <v-btn  icon v-on:click="goHome()"><v-icon>mdi-menu</v-icon></v-btn>
        </v-col>
        <v-col  class="d-flex justify-center" cols="10">
          <h4>{{titulo}}</h4>
        </v-col>
        <v-col  class="d-flex justify-center" cols="1">
          <v-btn  icon v-on:click="logout()"><v-icon>mdi-logout</v-icon></v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
</template>
<script>
  import store from '../store'

  export default {
    name: 'AppBar',
    props: {
      titulo: String, urlLogo: String
    },
    data() {return {}    
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
.linha {
  background-color: transparent;
  padding: 0px 5px 0px 5px;
  justify-items: center;
  align-items: center;
}

</style>