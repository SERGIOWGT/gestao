<template>
  <v-container fill-height>
    <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
    <ProgressBar :mensagem="mensagemAguarde" />
    <Login :tokenSistema="tokenSistema" @cbAutenticado= "cbAutenticado"/>
  </v-container>
</template>
<script>
  import mainService from '../services/mainService'
  import MessageBox from '../lastec.components/lastec-messagebox'
  import ProgressBar from '../lastec.components/lastec-progressbar'
  import Login from '../lastec.components/lastec-login'
  
  export default {inject: {
      theme: {
        default: { isDark: false },
      },
    },
    components:{
      ProgressBar, MessageBox, Login
    },
    data() {
      return {
        tokenSistema:'ebe4c237-f13d-11eb-a054-566fe1410274',
        tipoMensagem: 0,
        mensagemDialog: '',
        mensagem: '',
        mensagemAguarde: ''
      }
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
      async cbAutenticado(param) {
        this.$store.commit('autenticadoSso', param)
        
        this.mensagemAguarde =  'Configurando o ambiente! Aguarde...'
        const usuarioGuid = this.$store.getters.usuarioGuid

        this.isLoading = true
        let erro = false
        const resposta = await mainService.autentica(usuarioGuid)        
        .catch (err => {
            this.mensagemAguarde =  ''
            this.isLoading = false
            this.mensagemErro =  'Autenticando API: ' + mainService.catchPadrao(err)
            erro = true
        });
        
        if (erro) {return}

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
        console.log('registraApi', 'Sintomas-Inicio')
        let _sintomas = []

        this.mensagemAguarde = this.mensagemPadrao
        await mainService.listaSintomas()
        .then (resp => {
            console.log('resp', resp)
          
            this.mensagemAguarde = '';
            _sintomas = (resp.status == 200) ? resp.data : []
        })
        .catch (resp => {
            this.mensagemAguarde = '';
            this.mensagemErro =  'ERR:3320-' + mainService.catchPadrao(resp)
            erro = true
        });
        if (erro) 
          return;

        let _comorbidades = []
        if (localStorage.getItem("comorbidades")) {
            _comorbidades = JSON.parse(localStorage.getItem("comorbidades") || '[]')
        } else {
          this.mensagemAguarde = this.mensagemPadrao
          await mainService.listaComorbidades()
          .then (resp => {
              this.mensagemAguarde = '';
              _comorbidades = (resp.status == 200) ? resp.data : []
              console.log('comorbidades <= api')
          })
          .catch (resp => {
              this.mensagemAguarde = '';
              this.mensagemErro =  'ERR:3321-'+mainService.catchPadrao(resp)
              erro = true
          });
          if (erro) 
            return;
        }
        console.log('registraApi', 'Comorbidades-Fim')

        const _param2 = {sintomas: _sintomas, comorbidades: _comorbidades}
        this.$store.commit('setaListaComuns', _param2)
        this.$store.commit('finalizaLogin', true)
        this.$router.push('/Home')
      }
    }
  }
</script>