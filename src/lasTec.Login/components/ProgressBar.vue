<template>
  <v-dialog
      v-model="mostra"
      hide-overlay
      persistent
      width="70%"
      :max-width="tamanhoJanela"
  >
    <v-card color="primary" dark>
      <v-card-text >
          {{mensagem}}
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
  export default {
    props: ['mensagem', 'tamanhoJanela', 'mostra']
  }
</script>

