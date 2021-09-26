<template>
    <v-container class="pa-0">
     <v-alert 
        class="mt-0 mb-2"
        color="blue darken-1"
        flat dark 
        icon="mdi-account"
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