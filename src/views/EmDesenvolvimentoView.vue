<template>
  <v-container fill-height>
    <v-row class="text-center">
      <v-col class="mb-4">
        <h4 class="font-weight-bold mb-3">
          Módulo em Desenvolvimento
        </h4>
        <v-btn class="primary" v-on:click="voltar()">voltar</v-btn>

      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    name: 'EmDesenvolvimento',
    methods: {
      voltar() {
        this.$router.back()
      }
    }
  }
</script>

