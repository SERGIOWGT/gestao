<template>
 <div class="text-center">
    <v-dialog
        v-model="visible"
        hide-overlay
        persistent
        width="400"
    >
      <v-flex v-if="tipo == 0">
        <v-card color="primary" dark>
          <v-card-text class="pt-2">
            {{mensagem}}
            <v-progress-linear 
              indeterminate
              color="white"
              class="mb-0 mt-2"
            ></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex v-if="tipo == 1">
        <v-card class="card1">
          <v-card-text class="pt-2">
          <p class="pa-2"><span class="texto1">{{mensagem}}</span></p>
          <v-divider></v-divider>
          </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                color="primary"
                text
                @click="fecha()"
              >Fecha</v-btn>
            </v-card-actions>
        </v-card>
      </v-flex>
    </v-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      tipo: Number, 
      mensagem: String
    },
    data() {
      return {
        visible: false
      }
    },
    watch: {
      mensagem: function(val) {
        this.visible  = !(val == '')
        console.log('mensagem: function(val)', val), this.visible;
      }
    },
    methods: {
      fecha() {
        this.visible = false
      }
    }
  }
</script>
<style scoped>
  .card1 {
    background-color: #f5e4e7;
  }
  .texto1 {
    color: red;
    font-weight: bold;
  }
  
  .texto2 {
    color:black;
    font-weight: bold;
  }
</style>