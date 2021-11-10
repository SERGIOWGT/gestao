<template>
  <v-container fill-height>
    <v-flex>
      <v-bottom-sheet v-model="showFormTrocaSenha" inset  max-width="500px">
        <v-sheet class="text-center">
          <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">TROCA DE SENHA</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-subtitle class="text-start text-subtitle-1">{{mensagemDialog}}</v-card-subtitle>
                <v-card-text class="text-start"> Informe seu nova senha e depois repita essa senha usando os campos abaixo.</v-card-text>
                <v-form ref="myForm" class="pt-5 mx-3" v-model="formTrocaSenhaValido">
                  <v-text-field class="pt-2" clearable 
                    label="Nova Senha"
                    v-model="senhaNova"
                    prepend-icon="mdi-lock"
                    :counter="tamanhoMaximoSenha"
                    :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
                    :type="!senhaNovaNaoVisivel ? 'password' : 'text'"
                    :append-icon="senhaNovaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (senhaNovaNaoVisivel = !senhaNovaNaoVisivel)"
                    @click:append="senhaNovaNaoVisivel = !senhaNovaNaoVisivel"
                  />
                  <v-text-field class="pt-2 pb-3" dense clearable 
                    label="Repita a Senha"
                    prepend-icon="mdi-lock"
                    v-model="senhaRepetida"
                    counter
                    :type="!senhaRepetidaNaoVisivel ? 'password' : 'text'"
                    :append-icon="senhaRepetidaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                    :append-icon-cb="() => (senhaRepetidaNaoVisivel = !senhaRepetidaNaoVisivel)"
                    @click:append="senhaRepetidaNaoVisivel = !senhaRepetidaNaoVisivel"
                    :rules="[rotinasLogin.SenhaRules.mesmaSenha(senhaNova)]"
                  />
                </v-form>
            </v-card-text>
            <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
              <v-spacer></v-spacer>
              <v-btn text small color="secundary" @click="showFormTrocaSenha=false" :disabled="isLoading">Fechar </v-btn>
              <v-btn text small color="primary" :disabled="!formTrocaSenhaValido || isLoading" v-on:click="trocaSenha()">Troca Senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-bottom-sheet>
      <v-bottom-sheet v-model="showFormEsqueciSenha" inset  max-width="500px">
        <v-sheet class="text-center">
          <v-card tile class="pa-0 ma-0">
            <v-card-title class="pa-2 teal lighten-2" > <span class="white--text subtitle-1">RENVIO DE SENHA</span> </v-card-title>
            <v-divider></v-divider>
            <v-card-text class="pa-0">
                <v-card-subtitle class="text-start text-subtitle-1">{{mensagemDialog}}</v-card-subtitle>
                <v-card-text class="text-start"> Informe o seu email no campo abaixo para enviarmos sua senha.</v-card-text>
                <v-form ref="myForm" class="pt-5 mx-3" v-model="formEsqueciSenhaValido">
                  <v-text-field 
                    :disabled="isLoading"
                    v-model="email"
                    :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
                    :label="nomeChave"
                    required
                    clearable
                    prepend-icon="mdi-account-circle"
                ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
              <v-spacer></v-spacer>
              <v-btn text small color="secundary" @click="showFormEsqueciSenha=false" :disabled="isLoading">Fechar </v-btn>
              <v-btn text small color="primary" :disabled="!formEsqueciSenhaValido || isLoading" v-on:click="esqueceuSenha()">Envia Senha</v-btn>
            </v-card-actions>
          </v-card>
        </v-sheet>
      </v-bottom-sheet>
    </v-flex>
    <v-container>
      <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
      <ProgressBar :mensagem="mensagemAguarde"/>
      <v-row class="justify-center pt-15 pb-15 px-3">
        <v-img class="shrink mr-2" contain src="../assets/logoTelaAbertura.jpeg"/>
      </v-row>
      <v-form class="my-2 px-2 " v-model="formValido" >
        <v-text-field 
          :disabled="isLoading"
          v-model="email"
          :rules="[rotinasLogin.ChaveRules.obrigatorio(), rotinasLogin.ChaveRules.valido(formatoChave)]"
          :label="nomeChave"
          required
          clearable
          prepend-icon="mdi-account-circle"
        ></v-text-field>
        <v-text-field 
          :disabled="isLoading"
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
        <v-row class="justify-center pt-5 mt-5">
            <v-btn :disabled="isLoading || !formValido" class="white--text teal lighten-2 botao-arredondado" v-on:click="autentica()">Acessar</v-btn>
        </v-row>
        <v-row dense class="justify-center pt-8" >
            <v-btn text :disabled="isLoading"  v-on:click="mostraformEsqueciSenha()"><span class="teal--text text--lighten-2 text-caption">Esqueceu sua senha?&nbsp; Clique aqui</span></v-btn>
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
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar'
  
  export default {inject: {
      theme: {
        default: { isDark: false },
      },
    },
    components:{
      ProgressBar, MessageBox
    },
    data() {
      return {
        emAbertura: true,
        nomeSistema: ''  ,
        
        showFormTrocaSenha: false,
        showFormEsqueciSenha: false,
        formEsqueciSenhaValido: false, 
        formTrocaSenhaValido: false, 
        formValido: false, 
        isLoading: true,
        senhaNaoVisivel: false,
        senhaNovaNaoVisivel: false,
        senhaRepetidaNaoVisivel: false,

        mensagemPadrao: 'Configurando o ambiente! Aguarde...',

        email: '',
        senha: '',
        senhaNova: '',
        senhaRepetida: '',
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

        tipoMensagem: 0,
        mensagemDialog: '',
        mensagem: '',
        mensagemAguarde: ''
      }
    },
    mounted() {
      this.listaConfiguracaoSso()
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
      mostraformEsqueciSenha() {
        this.showFormEsqueciSenha =true
      },
      async listaConfiguracaoSso() {
        this.isLoading = true
        this.mensagemAguarde = "Preparando ambiente. Aguarde..."
        await sso.listaConfiguracao(this.tokenSistema)
        .then (resposta =>  {
          this.isLoading = false
          this.mensagemAguarde = ''
          this.sistemaId =  resposta.data.sistemaId;
          this.permiteRegistroUsuario = resposta.data.permiteRegistroUsuario;
          this.urlImagemLogin = resposta.data.urlImagemLogin;
          this.nomeChave = resposta.data.nomeChave;
          this.formatoChave = resposta.data.formatoChave;
          this.tamanhoMaximoSenha =  resposta.data.tamanhoMaximoSenha;
          this.tamanhoMinimoSenha = resposta.data.tamanhoMinimoSenha;
          this.formatoSenha = resposta.data.formatoSenha;
          this.mensagemErroFormatoSenha = resposta.data.mensagemErroFormatoSenha;

          let param = {
            sistemaId: this.sistemaId,
            nomeSistema: resposta.data.nomeSistema,
            plataformaId: resposta.data.plataformaId,
            nomePlataforma: resposta.data.nomePlataforma,
            urlImagemLogin: this.urlImagemLogin,
            tamanhoMaximoSenha: this.tamanhoMaximoSenha,
            tamanhoMinimoSenha: this.tamanhoMinimoSenha,
            formatoSenha: this.formatoSenha,
            mensagemErroFormatoSenha: this.mensagemErroFormatoSenha
          }
          this.$store.commit('setaConfiguracaoSistema', param)
        })
        .catch (err => {
            this.mensagemAguarde = ''; 
            this.mensagemErro= mainService.catchPadrao(err); 
        });
      },
      async esqueceuSenha() {
        this.isLoading =true;
        this.mensagemAguarde =  'Solicitando envio da senha! Aguarde...'
        await sso.esqueceuSenha(this.tokenSistema, this.email, this.senha, this.senhaNova)
        .then (resp => {
          this.mensagemAguarde =  ''
          this.isLoading =false;
          if (resp.status == 204){
            this.mensagemSucesso = 'Solicitação feita com sucesso. Verifique o e-mail.'
            this.showFormEsqueciSenha = false
          } else {
              this.mensagemErro =  resp.message
          } 
        })
        .catch (err => {
          this.mensagemAguarde =  '';
          this.isLoading =false; 
          this.mensagemErro =  mainService.catchPadrao(err)
        });
      },
      async trocaSenha() {
        this.isLoading =true;
        this.mensagemAguarde =  'Trocando a senha! Aguarde...'
        await sso.trocaSenha(this.tokenSistema, this.email, this.senha, this.senhaNova)
        .then (resp => {
          this.mensagemAguarde =  ''
          this.isLoading =false;
          if (resp.status == 204){
            this.mensagemSucesso = 'Senha trocada com sucesso. A partir de agora, use a senha nova'
            this.showFormTrocaSenha = false
          } else {
              this.mensagemErro =  resp.message
          } 
        })
        .catch (err => {
          this.mensagemAguarde =  '';
          this.isLoading =false; 
          this.mensagemErro =  mainService.catchPadrao(err)
        });
      },
      async registraApi() {
        this.mensagemAguarde =  this.mensagemPadrao
        const usuarioGuid = this.$store.getters.usuarioGuid

        let erro = false
        const resposta = await mainService.autentica(usuarioGuid)        
        .catch (err => {
            this.mensagemAguarde =  ''
            this.isLoading = false
            this.mensagemErro =  'Autenticando API: ' + mainService.catchPadrao(err)
            erro = true
        });
        
        if (erro) {
          return
        }

        if (resposta.status != 200) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  resposta.message
          return;
        }

        const _dados = resposta.data
        if (!((_dados.token) && (_dados.cidadesAutorizadasDTO))) {
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32158] '
          return;
        }

        const _cidades = _dados.cidadesAutorizadasDTO
        if (_cidades.length == 0) {
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32157] '
          return
        }

        if (!((_cidades[0].cidadeId) && (_cidades[0].nomeCidade))) {
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32156] '
          return
        }

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
        }
        this.$store.commit('autenticadoApi', _param)
          
        // Pegas as comorbidades e sintomas
        let _sintomas = []
        this.mensagemAguarde = this.mensagemPadrao
        await mainService.listaSintomas()
        .then (resp => {
            this.mensagemAguarde = '';
            _sintomas = (resp.status == 200) ? resp.data : []
        })
        .catch (resp => {
            this.mensagemAguarde = '';
            this.mensagemErro =  mainService.catchPadrao(resp)
            erro = true
        });
        if (erro) 
          return;

        let _comorbidades = []
        this.mensagemAguarde = this.mensagemPadrao
        await mainService.listaComorbidades()
        .then (resp => {
            this.mensagemAguarde = '';
            _comorbidades = (resp.status == 200) ? resp.data : []
        })
        .catch (resp => {
            this.mensagemAguarde = '';
            this.mensagemErro =  mainService.catchPadrao(resp)
            erro = true
        });
        if (erro) 
          return;

        const _param2 = {sintomas: _sintomas, comorbidades: _comorbidades}
        this.$store.commit('setaListaComuns', _param2)
        this.$store.commit('finalizaLogin', true)
        this.$router.push('/Home')
      },
      async autentica() {
        this.isLoading =true;
        this.mensagemAguarde =  'Autenticando usuário! Aguarde...'
        await sso.autentica(this.tokenSistema, this.email, this.senha)
        .then (resposta => {
          this.isLoading =false;
          this.mensagemAguarde =  ''

          const data=resposta.data
          if (data.primeiroAcesso) {
            this.showFormTrocaSenha = true
            this.mensagemDialog = 'Você precisa de trocar de senha pois é seu primeiro acesso.'
            return
          }
          if (data.senhaExpirada) {
            this.showFormTrocaSenha = true
            this.mensagemDialog = 'Você precisa de trocar de senha pois sua senha está expirada.'
            return
          }
          if (data.bloqueado) {
            this.showFormTrocaSenha = true
            this.mensagemDialog = 'Você precisa de trocar de senha pois sua senha está bloqueada'
            return
          }
          if (!data.usuarioGuid) {
            this.mensagemErro = 'Chave do usuário não encontrada!'
            return
          }

          const param = {
            email: this.email,
            usuarioId: data.usuarioId,
            token: data.token,
            nomeUsuario: data.nomeUsuario,
            permissionamento: data.permissionamento,
            usuarioGuid: data.usuarioGuid,
            sistemaId: data.sistemaId
          }

          this.$store.commit('autenticadoSso', param)
          this.registraApi()
        })
        .catch (err => {
          this.mensagemAguarde =  '';
          this.isLoading =false; 
          this.mensagemErro =  'Autenticando usuário: ' + mainService.catchPadrao(err)});
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
