<template>
  <v-layout class="pa-0 ma-0 grey lighten-5" align-content-start justify-end row fill-height>
    <v-container class="pa-0">
      <BasicDialog :mostra="infoDialog.mensagem != ''" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem" @funcaoRetorno='fechaDialog()'/>
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
                    <v-icon :color="item.iconColor">{{item.icon}}</v-icon><span :class="'ml-2 ' + item.textColor"> {{item.text}}</span>
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
  import BasicDialog from '../components/BasicDialog';
  import store from '../store'

  export default {
    components: {
        BasicDialog
    },
    data() {
      return {
        // Dados

        infoDialog: {
          tipo: 0,
          mensagem: ''
        },

        token: '',
        mostraTela:false,
        semAcesso: true,
        funcionalidades: [
          {
              id: 1, 
              textColor: 'blue--text', 
              text: 'Cadastre o cidadão com suspeita de alguma enfermidade', 
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
              text: 'Cadastre o cidadão Exemplo 2', 
              icon: 'mdi-alert-outline', 
              iconColor: 'blue', 
              ativo: false,
              func: 'cadastraMonitoramento2()', 
              perms: [
                {id:101, tipoId:1, acao:'I'},
                {id:102, tipoId:1, acao:'I'},
                {id:103, tipoId:1, acao:'I'},
                {id:105, tipoId:1, acao:'I'},
                {id:106, tipoId:1, acao:'I'},
                {id:107, tipoId:1, acao:'C'}
              ]
          }, {   
              id: 3, 
              textColor: 'blue--text', 
              text: 'Atualize as visitas na residência do cidadão', 
              icon: 'mdi-bed', 
              iconColor: 'blue', 
              ativo: false,
              func: 'naoImplementada()',
              perms: [
                {id:107, tipoId:1, acao:'C'}
              ]
          },
          {   
              id: 4, 
              textColor: 'blue--text', 
              text: 'Atualize os cadastros básicos do sistema', 
              icon: 'mdi-emoticon-sick', 
              iconColor: 'blue', 
              ativo: false,
              func: 'cadastraMonitoramento(2)',
              perms: [
                {id:103, tipoId:1, acao:'A'}, 
                {id:105, tipoId:1, acao:'A'},
                {id:106, tipoId:1, acao:'C'}
              ]
          },
        ]
      }
    },
    created() {
      if (!store.getters.autenticadoApi) 
        this.autenticaNoPainelSaude()
       else 
        this.preparaTela()
    },
    mounted() {
      
    },        
    computed: {
      mensagemBusca: {
          get: function() { return this.infoDialog.mensagem},
          set: function(mensagem) {
            this.infoDialog.tipo = 0
            this.infoDialog.mensagem = mensagem
          }
      },
      mensagemErro: {
          get: function() { return this.infoDialog.mensagem},
          set: function(mensagem) {
            this.infoDialog.tipo = 1
            this.infoDialog.mensagem = mensagem
          }
      }
    },
    methods: {
      fechaDialog() {
        this.infoDialog.mensagem = ''
      },
      async autenticaNoPainelSaude() {
        this.mensagemBusca = 'Aguarde a autenticação no ambiente...'
        await mainService.autentica("a313f0e9-f392-11eb-a3f4-566fe1410277")
          .then(resposta => {
              console.log("await autenticaNoPainelSaude-then")
              this.mensagemBusca = ''
              if (resposta.status == 200) {
                let _dados = resposta.data
                if ((_dados.token) && (_dados.cidadesAutorizadasDTO)) {
                  let _cidades = _dados.cidadesAutorizadasDTO
                  if (_cidades.length > 0) {
                    if ((_cidades[0].cidadeId) && (_cidades[0].nomeCidade)) {
                      let _param = {}
                      _param.token = _dados.token
                      _param.cidadeId = _cidades[0].cidadeId
                      _param.nomeCidade = _cidades[0].nomeCidade
                      this.$store.commit('autenticadoApi', _param)
                      this.preparaTela()
                    } else {
                      this.mensagemErro = 'Erro na autenticacao da Api. [ErroId=32156] '
                    }
                  } else {
                    this.mensagemErro = 'Erro na autenticacao da Api. [ErroId=32157] '
                  }
                }
                else {
                  this.mensagemErro = 'Erro na autenticacao da Api. [ErroId=32158] '
                }
              } else {
                console.log('Erro', resposta.message)
                this.mensagemErro = resposta.message
              }
        })
        .catch((response) => {
          console.log("await autenticaNoPainelSaude-catch")
          this.mensagemErro =  mainService.catchPadrao(response)
        })
      },      
      executaFuncao(id) {
        this.mensagemErro = ''
        switch (id) {
          case 1:
            this.$router.push('novaSuspeita') 
            break
          case 2:
            this.$router.push('identificacaoCidadao') 
            break
          case 3:
            this.$router.push('visita') 
            break
          case 4:
            this.$router.push('cadastros') 
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
<style scoped>
 
  .xxx {
    height: 50px;
  }
</style>

