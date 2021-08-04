<template>
    <v-container class="pa-0">
     <v-alert
        color="blue lighten-1 white--text"
        flat
        icon="mdi-account"
        prominent
      >
        Olá, {{$store.getters.nomeUsuario}} <br>
        {{$store.getters.nomeCidade}}
      </v-alert>
    </v-container>
</template>
<script>
  export default {
    name: 'UserBar'
  }
</script>