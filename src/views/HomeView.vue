<template>
  <v-layout class="pa-0 ma-0 grey lighten-5" align-content-start justify-end row fill-height>
    <v-container class="pa-0">
      <v-row class="justify-center" v-if="mensagemErro">
        <v-alert type="error" smaller dense outlined>
          {{mensagemErro}}
        </v-alert>
      </v-row> 

      <v-alert
        v-show="mostraTela && semAcesso"
        text
        prominent
        type="error"
        icon="mdi-cloud-alert"
      >
        Você está sem permissão para acessar esse sistema. Por favor, fale com o administrador
      </v-alert>
      <v-layout justify-center class="my-0" v-show="mostraTela && !semAcesso">
        <v-layout justify-center class="px-5 py-2">
          <v-expansion-panels inset >
            <v-expansion-panel class="green lighten-4">
              <v-expansion-panel-header>    
                <div class="d-flex align-center">
                  <v-icon color="green">mdi-help-circle-outline</v-icon> <span class="ml-2 green--text">Os postos de vacinação mudaram seus horários.</span>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content class="green lighten-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
      <v-layout justify-center class="mt-1" v-show="mostraTela" v-for="item in funcionalidades" :key="item.id" >
        <v-layout justify-center class="px-5 py-2" v-show="item.ativo==true">
          <v-expansion-panels >
            <v-expansion-panel class="white py-2">
              <v-expansion-panel-header disable-icon-rotate>    
                <div class="d-flex align-center">
                    <v-icon :color="item.iconColor">{{item.icon}}</v-icon><span :class="'ml-2 ' + item.textColor"> {{item.text}}}</span>
                </div>
                <template v-slot:actions>
                  <v-icon v-on:click="executaFuncao(item.id)" color="blue">mdi-arrow-right-circle-outline</v-icon>
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
  
  import mainService from '../services/MainService'

  export default {
    data() {
      return {
        token: '',
        mostraTela:false,
        mensagemErro: '',
        semAcesso: true,
        funcionalidades: [
            {
                id: 1, 
                textColor: 'blue--text', 
                text: 'Cadastre paciente com suspeita de Covid-19', 
                icon: 'mdi-alert-outline', 
                iconColor: 'blue', 
                ativo: false,
                func: 'cadastraMonitoramento()', 
                perms: [
                  {id:101, tipoId:1, acao:'I'},
                  {id:102, tipoId:1, acao:'I'},
                  {id:103, tipoId:1, acao:'I'},
                  {id:105, tipoId:1, acao:'I'},
                  {id:106, tipoId:1, acao:'I'},
                  {id:107, tipoId:1, acao:'C'}
                ]
            }, {   
                id: 2, 
                textColor: 'blue--text', 
                text: 'Atualize aqui os sintomas de um paciente em monitoramento', 
                icon: 'mdi-emoticon-sick', 
                iconColor: 'blue', 
                ativo: false,
                func: 'naoImplementada()',
                perms: [
                  {id:103, tipoId:1, acao:'A'}, 
                  {id:105, tipoId:1, acao:'A'},
                  {id:106, tipoId:1, acao:'C'}
                ]
            },{   
                id: 3, 
                textColor: 'blue--text', 
                text: 'Atualize as visitas na residência do paciente', 
                icon: 'mdi-bed', 
                iconColor: 'blue', 
                ativo: false,
                func: 'naoImplementada()',
                perms: [
                  {id:107, tipoId:1, acao:'C'}
                ]
            }

        ]
      }
    },
    mounted() {
        if (this.$store.getters.estaLogado) {
          this.preparaTela()

            console.log("PainelSaude ==> Chamada")
            mainService.autentica("d5f52a0e-f212-11eb-a054-566fe1410274", "a313f0e9-f392-11eb-a3f4-566fe1410277")
            .then(resposta => {
              if (resposta.status == 200) {
                this.$store.commit('autenticadoApi', resposta.data.token)
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
            })
            .catch((response) => {
                console.log("PainelSaude ==> VoltaErro")
                if (response) {
                  this.mensagemErro = "";
                  response.erros.forEach(el => {
                    this.mensagemErro += el.mensagem;
                  });
                } else {
                  // Something happened in setting up the request that triggered an Error
                  console.log('Erro', response.message);
                  this.mensagemErro = response.message;
                }
            })
        } else {
          this.preparaTela()
        }
    },
    methods: {
      executaFuncao(id) {

        this.mensagemErro = ''
        switch (id) {
          case 1:
            this.$router.push('novaSuspeita') 
            break
          default:
            this.mensagemErro = `funcionalidade não implementada [id=${id}]`
        }
      },
      preparaTela() {
        for (var i=0; i < this.funcionalidades.length; ++i) {
          var _passouTodos = true
          for (var j=0; j < this.funcionalidades[i].perms.length; ++j) {
            var _item = this.funcionalidades[i].perms[j];
            if (mainService.temAcesso(_item.id, _item.tipoId, _item.acao) == false) {
              _passouTodos = false;
              break;
            }
          }
          if (_passouTodos) {
            this.semAcesso = false
            this.funcionalidades[i].ativo = true
          }
        }
        this.mostraTela = true
      }
    }
  }
</script>
