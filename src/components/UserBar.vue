<template>
    <v-container class="pa-0">
     <v-alert 
        class="ma-0"
        color="teal lighten-2"
        flat dark tile
        icon="mdi-account"
      >
        Olá, {{nomeUsuario}} <br>
        {{nomeCidade}}
      </v-alert>
    </v-container>
</template>
<script>
  import store from '../store'
  export default {
    name: 'UserBar',
    data() {
      return {
        nomeUsuario: '',
        nomeCidade: ''
      }
    },
    created() {
      this.nomeUsuario = store.getters.nomeUsuario
      const cidade = store.getters.cidadePadrao
      this.nomeCidade = cidade.nome
    }
  }
</script>