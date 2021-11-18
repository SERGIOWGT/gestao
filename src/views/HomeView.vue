<template>
  <v-layout class="pa-0 ma-0" align-content-start justify-end row fill-height>
    <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
    <ProgressBar :mensagem="mensagemAguarde"/>
    <v-container class="pa-0 ma-0 ">
      <v-layout justify-center class="mt-2 px-0" v-show="mostraTela" v-for="item in funcionalidades" :key="item.id" >
        <v-layout justify-center class="px-6 py-2" v-show="item.ativo==true">
          <v-expansion-panels focused>
            <v-expansion-panel class="py-1 blue-grey lighten-5">
              <v-expansion-panel-header disable-icon-rotate v-on:click="executaFuncao(item.id)">    
                <div class="d-flex align-center">
                    <v-icon :color="item.iconColor">{{item.icon}}</v-icon><span :class="'ml-2 ' + item.textColor"> {{item.text}}</span>
                </div>
                <template v-slot:actions>
                  <v-icon v-on:click="executaFuncao(item.id)" :color="item.iconColor">mdi-arrow-right-circle-outline</v-icon>
                </template>
              </v-expansion-panel-header>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-layout>
      </v-layout>
    </v-container>
  </v-layout>
</template>
<script>
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar'
  import {temAcesso} from '../rotinasProjeto/rotinasProjeto'

  export default {
    components: {
      ProgressBar, MessageBox
    },
    data() {
      return {
        // Dados
        tipoMensagem: 0,
        mensagem: '',
        mensagemAguarde: '',

        token: '',
        mostraTela:false,
        semAcesso: true,
        funcionalidades: [
          {
              id: 1, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Adicione ou atualize os dados do cidadão ', 
              icon: 'mdi-account-plus-outline', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento2()', 
              perms: [{id:109, tipoId:1, acao:'I'}, {id:110, tipoId:1, acao:'C'}
              ]
          }, {   
              id: 2, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Registre as visitas na residência do cidadão', 
              icon: 'mdi-home-map-marker', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'naoImplementada()',
              perms: [
                {id:111, tipoId:1, acao:'I'},
              ]
          },
          {   
              id: 3, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Consulte as visitas e execute as baixas', 
              icon: 'mdi-gesture-double-tap', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento(2)',
              perms: [
                {id:115, tipoId:1, acao:'I'}, 
                {id:116, tipoId:1, acao:'C'}
              ]
          },
          {   
              id: 4, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Consulte as visitas de um cidadão', 
              icon: 'mdi-account-details-outline', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento(2)',
              perms: [
                {id:1112, tipoId:1, acao:'C'}
              ]
          },
          {   
              id: 5, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Atualize os cadastros básicos', 
              icon: 'mdi-hammer-wrench', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento(3)',
              perms: [
                {id:101, tipoId:1, acao:'A'}, 
                {id:102, tipoId:1, acao:'C'}, 
                {id:103, tipoId:1, acao:'A'}, 
                {id:104, tipoId:1, acao:'C'}, 
                {id:105, tipoId:1, acao:'A'}, 
                {id:106, tipoId:1, acao:'C'}, 
                {id:107, tipoId:1, acao:'A'}, 
                {id:108, tipoId:1, acao:'C'} 
              ]
          },
          {   
              id: 6, 
              textColor: 'teal--text text--lighten-2', 
              text: 'Adicione, edite ou remova usuários do sistema', 
              icon: 'mdi-account-tie', 
              iconColor: 'teal lighten-2', 
              ativo: false,
              func: 'cadastraMonitoramento(3)',
              perms: [
                {id:113, tipoId:1, acao:'A'},
                {id:114, tipoId:1, acao:'C'}
              ]
          },
        ]
      }
    },
    created() {
      this.preparaTela()
      this.$store.commit('habilitaUserbar', true)
    },
    computed: {
      mensagemErro: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 1
          this.mensagem = val
        }
      },
      mensagemSucesso: {
        get: function() { return this.mensagem},
        set: function(val) {
          this.tipoMensagem = 0
          this.mensagem = val
        }
      },
    },
    methods: {
      executaFuncao(id) {
        switch (id) {
          case 1:
            this.$router.push('cidadao');
            break;
          case 2:
            this.$router.push('visita');
            break;
          case 3:
            this.$router.push('visitaEncerra') 
            break
          case 4:
            this.$router.push('visitaConsulta') 
            break;
          case 5:
            this.$router.push('cadastroBasico') 
            break
          case 6:
            this.$router.push('usuario') 
            break
          default:
            this.mensagemErro = `funcionalidade não implementada [id=${id}]`
        }
      },
      preparaTela() {
        let _temAcesso = false
        for (var i=0; i < this.funcionalidades.length; ++i) {
          _temAcesso = false
          for (var j=0; j < this.funcionalidades[i].perms.length; ++j) {
            const _item = this.funcionalidades[i].perms[j];
            if (temAcesso(this.$store.getters.permissionamento, _item.id, _item.tipoId, _item.acao)) {
              _temAcesso = true
              j = this.funcionalidades[i].perms.length
            }
          }
          if (_temAcesso) {
            this.semAcesso = false
            this.funcionalidades[i].ativo = true
          }
        }
        this.mostraTela = true
      }
    }
  }
</script>

