<template>
  <v-layout class="pa-0 ma-0 grey lighten-5" align-content-start justify-end row fill-height>
    <v-container class="pa-0">
        <v-alert
          color="blue lighten-1 white--text"
          flat
          icon="mdi-account"
          prominent
        >
          Olá, {{$store.getters.nomeUsuario}} <br>
          {{$store.getters.nomeMunicipio}}
        </v-alert>
        <v-layout justify-center class="my-2">
          <v-layout justify-center class="px-5 pa-2">
            <v-expansion-panels inset >
              <v-expansion-panel class="orange lighten-5">
                <v-expansion-panel-header>    
                    <div class="d-flex align-center">
                      <v-icon color="red">mdi-alert-circle-outline</v-icon> <span class="ml-2 red--text">Fique atento aos novos procedimentos sobre o COVID </span>
                    </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="ml-2 red--text">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>
      </v-layout>
      <v-layout justify-center class="my-0">
          <v-layout justify-center class="px-5 py-2">
            <v-expansion-panels inset >
              <v-expansion-panel class="green lighten-4">
                <v-expansion-panel-header>    
                  <div class="d-flex align-center">
                    <v-icon color="green">mdi-help-circle-outline</v-icon> <span class="ml-2 green--text">Novo horário dos postos de saúde </span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content class="green lighten-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-layout>
      </v-layout>
      <v-layout justify-center class="mt-5" >
        <v-layout justify-center class="px-5 py-2">
          <v-expansion-panels accordion >
            <v-expansion-panel class="white py-2">
              <v-expansion-panel-header disable-icon-rotate>    
                <div class="d-flex align-center">
                    <v-icon color="blue">mdi-alert-outline</v-icon><span class="ml-2 blue--text">Cadastre paciente com suspeita de Covid-19 </span>
                 </div>
                <template v-slot:actions>
                  <v-icon @click="setaEtapaAtual()" color="blue">mdi-arrow-right-circle-outline</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
      <v-layout justify-center class="my-0" >
        <v-layout justify-center class="px-5 py-2">
          <v-expansion-panels accordion >
            <v-expansion-panel class="white py-2">
              <v-expansion-panel-header disable-icon-rotate>    
                <div class="d-flex align-center">
                    <v-icon color="blue">mdi-emoticon-sick</v-icon><span class="ml-2 blue--text">Atualize aqui os sintomas de um paciente em monitoramento </span>
                </div>
                <template v-slot:actions>
                  <v-icon color="blue">mdi-arrow-right-circle-outline</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
      <v-layout justify-center class="my-0" >
        <v-layout justify-center class="px-5 py-2">
          <v-expansion-panels accordion >
            <v-expansion-panel class="white py-2">
              <v-expansion-panel-header disable-icon-rotate>    
                <div class="d-flex align-center">
                    <v-icon color="blue">mdi-bed</v-icon><span class="ml-2 blue--text">Atualize as visitas na residência do paciente</span>
                </div>
                <template v-slot:actions>
                  <v-icon color="blue">mdi-arrow-right-circle-outline</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
      <v-layout justify-center class="my-0" >
        <v-layout justify-center class="pa-5" >
          <v-expansion-panels accordion >
            <v-expansion-panel class="white py-2">
              <v-expansion-panel-header disable-icon-rotate>    
                <div class="d-flex align-center">
                  <v-icon color="blue">mdi-alert-outline</v-icon><span class="ml-2 blue--text">Funcionalidade B</span>
                </div>
                <template v-slot:actions>
                  <v-icon color="blue">mdi-arrow-right-circle-outline</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
    </v-container>

   <!--  <v-bottom-navigation
        color="teal"
        grow
        fixed
    >
        <v-btn  @click="btnCancela()">
            <span>Novo</span>
            <v-icon>mdi-account-alert-outline</v-icon>
        </v-btn>
        <v-btn  @click="btnCancela()">
            <span>Sintomas</span>
            <v-icon>mdi-emoticon-sick</v-icon>
        </v-btn>
        <v-btn  @click="btnFinaliza()">
            <span>Visitas</span>
            <v-icon>mdi-bed</v-icon>
        </v-btn>
        <v-btn @click="btnNovoPaciente()">
            <span>??????</span>
            <v-icon>mdi-home</v-icon>
        </v-btn>
    </v-bottom-navigation> -->
  </v-layout>
</template>
<script>
  
  export default {
    data() {
      return {
        funcionalidades: [
            {id: 0, textColor: 'blue', text: 'Cadastre paciente com suspeita de Covid-19', icon: 'mdi-alert-outline', iconColor: 'blue', func: 'naoImplementada()'},
            {id: 0, textColor: 'blue', text: 'Atualize aqui os sintomas de um paciente em monitoramento', icon: 'mdi-emoticon-sick', iconColor: 'blue', func: 'naoImplementada()'},
            {id: 0, textColor: 'blue', text: 'Atualize as visitas na residência do paciente', icon: 'mdi-bed', iconColor: 'blue', func: 'naoImplementada()'}
        ]
      }
    },
    methods: {
      setaEtapaAtual() {
        alert('funcionalidade não implementada')
      }
    }
  }
</script>
