<template>
  <v-container fill-height>
      <v-container>
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <v-row class="justify-center pt-15 pb-15 px-3">
<!--           <v-responsive :aspect-ratio="16/9">
        <v-card-text>
          This card will always be 16:9 (unless you put more stuff in it)
        </v-card-text>
      </v-responsive> -->
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

        tipoMensagem: 0,
        mensagem: '',
        mensagemAguarde: ''
      }
    },
    mounted() {
      this.consultaSso()
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
        .catch (err => {this.mensagemErro= mainService.catchPadrao(err); });
      },

      async autenticaApi() {
        this.mensagemAguarde =  'Algumas informações estão sendo carregadas! Aguarde'
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
          this.mensagemAguarde =  ''
          this.isLoading = false
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

/*                   _param.unidadeSaudeId= 2
        _param.nomeUnidadeSaude='TANCREDO NEVES - PSF VIVER BEM'
        _param.microAreaId= 7
        _param.nomeMicroArea= '07 - TATIANE CONCEICAO DO NASCIMENTO'
        _param.bairroId= 8
        _param.nomeBairro= 'CHACARA'
        _param.logradouroId= 53
        _param.nomeLogradouro= 'SÂO JOAO' */
        this.$store.commit('autenticadoApi', _param)
          
        // Pegas as comorbidades e sintomas
        let _sintomas = []
        this.mensagemAguarde = 'Buscando sintomas! Aguarde...'
        await mainService.listaSintomas()
        .then (resp => {_sintomas = (resp.status == 200) ? resp.data : []})
        .catch (resp => {
            this.mensagemErro =  mainService.catchPadrao(resp)
            erro = true
        });
        this.mensagemAguarde = ''

        if (erro) 
          return;

        let _comorbidades = []
        this.mensagemAguarde = 'Buscando Comorbidades! Aguarde...'
        await mainService.listaComorbidades()
        .then (resp => {_comorbidades = (resp.status == 200) ? resp.data : []})
        .catch (resp => {
            this.mensagemErro =  mainService.catchPadrao(resp)
            erro = true
        });
        this.mensagemAguarde = ''

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
            this.mensagemErro = 'Esse é sem primeiro acesso. Favor trocar a senha!'
            return
          }
          if (data.senhaExpirada) {
            this.mensagemErro = 'Senha expirada. Favor trocar a senha!'
            return
          }
          if (data.bloqueado) {
            this.mensagemErro = 'Senha bloqueado. Favor trocar a senha!'
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
          console.log(param)
          this.$store.commit('autenticadoSso', param)
          this.autenticaApi()
        })
        .catch (err => {this.isLoading =false; this.mensagemErro =  'Autenticando usuário: ' + mainService.catchPadrao(err)});
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
