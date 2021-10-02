<template>
  <v-container fill-height>
      <v-container >
        <BasicDialog :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem" /> 
        <v-row class="justify-center pt-0 pb-15 px-3">
            <v-img
              class="shrink mr-2"
              contain
              src="../assets/logoTelaAbertura.jpeg"
            />
         </v-row>
        <v-form class="my-2 px-2 " v-model="formularioValido" >
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
              <v-btn :disabled="isLoading" class="white--text teal lighten-2 botao-arredondado" v-on:click="autentica()">Acessar</v-btn>
          </v-row>
          <v-row dense class="justify-center pt-8" >
              <v-btn text :disabled="isLoading"><span class="teal--text text--lighten-2 text-caption">Esqueceu sua senha?&nbsp; Clique aqui</span></v-btn>
          </v-row>
          <v-row class="justify-center pt-3" v-if="permiteRegistroUsuario">
            <v-btn text :disabled="isLoading"><span class="texto text-caption"> Sua primeira vez?&nbsp; Crie aqui seu usuário</span></v-btn>
          </v-row>
        </v-form>
      </v-container>
  </v-container>
</template>
<script>
  import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'
  import sso from '../services/ssoService'
  import mainService from '../services/mainService'
  import BasicDialog from '../components/BasicDialog';
  import {rotinasBasicDialog} from '../rotinasProjeto/rotinasProjeto'
  import store from '../store'

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
        rotinasBasicDialog.mensagemBusca(this.infoDialog, 'Algumas informações estão sendo carregadas! Aguarde')
        const usuarioGuid = store.getters.usuarioGuid
        await mainService.autentica(usuarioGuid)
        .then((resposta)=> {
          rotinasBasicDialog.mensagemBusca(this.infoDialog, '')
          this.isLoading = false

          if (resposta.status == 200) {
            const _dados = resposta.data
            if ((_dados.token) && (_dados.cidadesAutorizadasDTO)) {
              let _cidades = _dados.cidadesAutorizadasDTO
              if (_cidades.length > 0) {
                if ((_cidades[0].cidadeId) && (_cidades[0].nomeCidade)) {
                  const _param = {
                    token: _dados.token,
                    cidadeId: _cidades[0].cidadeId,
                    nomeCidade: _cidades[0].nomeCidade,
                    autenticado: true,
                    unidadeSaudeId: _cidades[0].unidadeSaudeId,
                    nomeUnidadeSaude: _cidades[0].nomeUnidadeSaude,
                    microAreaId: _cidades[0].microAreaId,
                    nomeMicroArea: _cidades[0].nomeMicroArea,
                    bairroId: _cidades[0].bairroId,
                    nomeBairro: _cidades[0].nomeBairro,
                    logradouroId: _cidades[0].logradouroId,
                    nomeLogradouro: _cidades[0].nomeLogradouro,


                    //unidadeSaudeId: 2,
                    //nomeUnidadeSaude:'TANCREDO NEVES - PSF VIVER BEM',
                    //microAreaId: 7,
                    //nomeMicroArea: '07 - TATIANE CONCEICAO DO NASCIMENTO',
                    //bairroId: 8,
                    //nomeBairro: 'CHACARA',
                    //logradouroId: 53,
                    //nomeLogradouro: 'SÂO JOAO',
                  }
                  console.log('autenticadoApi', _param)

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
          this.isLoading =false;
          const param = {
            email: this.email,
            usuarioId: resposta.data.usuarioId,
            token: resposta.data.token,
            nomeUsuario: resposta.data.nomeUsuario,
            permissionamento: resposta.data.permissionamento,
            usuarioGuid: resposta.data.usuarioGuid
          }
          this.$store.commit('autenticadoSso', param)
          this.autenticaApi()
        })
        .catch (err => {this.isLoading =false; rotinasBasicDialog.mensagemErro(this.infoDialog, 'Autenticando usuário: ' + mainService.catchPadrao(err))});
      }
    }
  }
</script>
<style scoped>
 
  
  .container {
    background-color:#FFFFFF !important; /* light-blue darken-1*/
  }
  
  .botao-arredondado{
      width: 90%;
      border-radius:10px!important;
  } 
  .arredondado{
      width: 90%;
      border-bottom-left-radius: 50px 50px; 
      border-bottom-right-radius: 50px 50px;
  } 
</style>