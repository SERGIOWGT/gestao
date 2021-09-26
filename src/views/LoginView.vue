<template>
  <v-container fill-height>
      <v-container>
        <BasicDialog :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem" /> 
        <v-row class="justify-center pt-0 pb-15">
            <span class="texto text-h1">LOGO</span>
         </v-row>
        <v-form class="my-2" v-model="formularioValido" >
          <v-text-field 
            v-model="email"
            :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
            :label="nomeChave"
            required
            clearable
            prepend-icon="mdi-account-circle"
          ></v-text-field>
          <v-text-field 
            label="Senha"
            clearable
            v-model="senha"
            :counter="tamanhoMaximoSenha"
            :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
            :type="!senhaNaoVisivel ? 'password' : 'text'"
            prepend-icon="mdi-lock"
            :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
            :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
            @click:append="senhaNaoVisivel = !senhaNaoVisivel"
          />
          <v-row class="justify-center pt-5 mt-5" >
              <v-btn :disabled="isLoading" class="primary botao-arredondado" v-on:click="autentica()">Acessar</v-btn>
          </v-row>
          <v-row dense class="justify-center pt-8" >
              <v-btn depressed text><span class="texto text-caption">Esqueceu sua senha?&nbsp; Clique aqui</span></v-btn>
          </v-row>
          <v-row class="justify-center pt-3" v-if="permiteRegistroUsuario">
            <v-btn text><span class="texto text-caption"> Sua primeira vez?&nbsp; Crie aqui seu usuário</span></v-btn>
          </v-row>
        </v-form>
      </v-container>

      <!-- <LoginComponent 
        :tokenSistema="'ebe4c237-f13d-11eb-a054-566fe1410274'"
        @autenticado='autenticado'
        @registraUsuario='registraUsuario'
        @setaConfiguracaoSistema='setaConfiguracaoSistema'
        @trocaSenha='trocaSenha'
      /> -->
  </v-container>
</template>
<script>
  //import AppBar from '../components/AppBar.vue'
  //import LoginComponent from  '../lasTec.Login/components/LoginComponent'
  //import TelaAbertura from '../components/TelaAbertura.vue'
  import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'
  import sso from '../services/ssoService'
  import mainService from '../services/MainService'
  import BasicDialog from '../components/BasicDialog';
  import {rotinasBasicDialog} from '../rotinasProjeto/rotinasProjeto'

  export default {inject: {
      theme: {
        default: { isDark: false },
      },
    },
    components:{
      BasicDialog
    },
    data() {
      return {
        emAbertura: true,
        nomeSistema: ''  ,
        
        dialog: true,
        showScheduleForm: false,
        showFormTrocaSenha: false,
        formularioValido: false, 
        isLoading: false,
        senhaNaoVisivel: false,

        email: 'sergiowgt@gmail.com',
        senha: 'Bbm@2007',
        rotinasLogin: RotinasLogin,

        tokenSistema:'ebe4c237-f13d-11eb-a054-566fe1410274',
        urlImagemLogin: '',
        tamanhoMinimoSenha: 0,
        tamanhoMaximoSenha: 0,
        nomeChave:  '',
        formatoChave:  '',
        formatoSenha:  '',
        mensagemErroFormatoSenha: '',
        permiteRegistroUsuario: false,

        infoDialog: {
          tipo: 0,
          mensagem: ''
        }
      }
    },
    mounted() {
      this.consultaSso()
    },
    methods: {
      trocaSenha() {   
        this.$router.push('/trocaSenha')
      },
      registraUsuario() {
        this.$router.push('/registraUsuario')
      },
     
      async consultaSso() {
        await sso.listaConfiguracao(this.tokenSistema)
        .then (resposta =>  {
          this.sistemaId =  resposta.data.sistemaId;
          this.permiteRegistroUsuario = resposta.data.permiteRegistroUsuario;
          this.urlImagemLogin = resposta.data.urlImagemLogin;
          this.nomeChave = resposta.data.nomeChave;
          this.formatoChave = resposta.data.formatoChave;
          this.tamanhoMaximoSenha =  resposta.data.tamanhoMaximoSenha;
          this.tamanhoMinimoSenha = resposta.data.tamanhoMinimoSenha;
          this.formatoSenha = resposta.data.formatoSenha;

          let param = {
            sistemaId: this.sistemaId,
            nomeSistema: resposta.data.nomeSistema,
            plataformaId: this.plataformaId,
            nomePlataforma: resposta.data.nomePlataforma,
            urlImagemLogin: this.urlImagemLogin,
            tamanhoMaximoSenha: this.tamanhoMaximoSenha,
            tamanhoMinimoSenha: this.tamanhoMinimoSenha,
            formatoSenha: this.formatoSenha
          }
          this.$store.commit('setaConfiguracaoSistema', param)
        })
        .catch (err => {rotinasBasicDialog.mensagemErro(this.infoDialog, mainService.catchPadrao(err)); });
      },

      async autenticaApi() {
        console.log('abc'); 
        rotinasBasicDialog.mensagemBusca(this.infoDialog, 'Configurando o ambiente! Aguarde')
        await mainService.autentica("a313f0e9-f392-11eb-a3f4-566fe1410277")
        .then((resposta)=> {
          rotinasBasicDialog.mensagemBusca(this.infoDialog, '')
          this.isLoading = false

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
                  _param.autenticado = true
                  this.$store.commit('autenticadoApi', _param)
                } else {
                  rotinasBasicDialog.mensagemErro(this.infoDialog, 'Erro na autenticacao da Api. [ErroId=32156] ')
                  return
                }
              } else {
                rotinasBasicDialog.mensagemErro(this.infoDialog, 'Erro na autenticacao da Api. [ErroId=32157] ')
                return
              }
            }
            else {
              rotinasBasicDialog.mensagemErro(this.infoDialog, 'Erro na autenticacao da Api. [ErroId=32158] ')
              return;
            }
          } else {
            console.log('Erro', resposta.message)
            rotinasBasicDialog.mensagemErro(this.infoDialog, resposta.message)
            return;
          }
          this.$router.push('/Home')
        })
        .catch (err => {
            rotinasBasicDialog.mensagemBusca(this.infoDialog, '')
            this.isLoading = false
            rotinasBasicDialog.mensagemErro(this.infoDialog, 'Autenticando API: ' + mainService.catchPadrao(err))
        });
      },
      async autentica() {
        this.isLoading =true;
        rotinasBasicDialog.mensagemBusca(this.infoDialog, 'Autenticando usuário! Aguarde...')
        await sso.autentica(this.tokenSistema, this.email, this.senha)
        .then (resposta => {
          const param = {
            email: this.email,
            usuarioId: resposta.data.usuarioId,
            token: resposta.data.token,
            nomeUsuario: resposta.data.nomeUsuario,
            permissionamento: resposta.data.permissionamento
          }
          this.$store.commit('autenticadoSso', param)
          this.autenticaApi()
        })
        .catch (err => {rotinasBasicDialog.mensagemErro(this.infoDialog, 'Autenticando usuário: ' + mainService.catchPadrao(err))});
      }
    }
  }
</script>
<style scoped>
 
  .texto {
    color: #304FFE /* indigo accent-4 */
  }
  .container {
    background-color:#FFFFFF !important; /* light-blue darken-1*/
  }
  
  .botao-arredondado{
      width: 90%;
      border-radius:10px!important;
  } 
</style>