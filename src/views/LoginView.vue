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
        tokenSistema: process.env.VUE_APP_TOKEN_SISTEMA,
        tipoMensagem: 0,
        mensagemDialog: '',
        mensagem: '',
        mensagemAguarde: '',
        VUE_APP_ROOT_API: process.env.VUE_APP_ROOT_API
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
        this.$store.commit('init', _param)
        
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
        if (!_dados.token) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  'Erro na autenticacao da Api. [ErroId=32158] '
          return;
        }

        if ((!_dados.cidadeId) || (!_dados.nomeCidade)) {
          this.mensagemAguarde =  ''
          this.mensagemErro =  'Código ou nome da Cidade inválidos . [ErroId=32156] '
          return
        }

        const _dataUltimaAtualizacao = _dados.dataAtualizacao;

        const _param = {
          token: _dados.token,
          cidadeId: _dados.cidadeId,
          nomeCidade: _dados.nomeCidade,
          unidadeSaudeId: _dados.unidadeSaudeId,
          nomeUnidadeSaude: _dados.nomeUnidadeSaude,
          microAreaId: _dados.microAreaId,
          nomeMicroArea: _dados.nomeMicroArea,
          bairroId: _dados.bairroId,
          nomeBairro: _dados.nomeBairro,
          logradouroId: _dados.logradouroId,
          nomeLogradouro: _dados.nomeLogradouro
        }
        this.$store.commit('autenticadoApi', _param)

        // Trata os dados persistentes
        let _carregaDados = true;
        const _dataUltimaCarga = this.$store.getters.dbDataCarga
        console.log('Data Server: ', _dataUltimaAtualizacao);
        console.log('Data Carga: ', _dataUltimaCarga);
        if ((_dataUltimaAtualizacao) && (_dataUltimaCarga)) {
          _carregaDados = _dataUltimaCarga < _dataUltimaAtualizacao
        }

        if (_carregaDados) {
          this.$store.commit('limpaDadosPersistentes', _params)

          let _params = {
            comorbidades: [],
            doencas: [],
            sintomas: []
          }
          this.mensagemAguarde = this.mensagemPadrao

          // SINTOMAS
          let resp = await mainService.listaSintomas()
          .catch (err => {
              this.mensagemAguarde = '';
              this.mensagemErro =  'ERR:3320-' + mainService.catchPadrao(err)
              erro = true
          });
          if (erro) 
            return;
          _params.sintomas = resp.status == 200 ? resp.data : [];

          // COMORBIDADES
          resp = await mainService.listaComorbidades()
            .catch (resp => {
                this.mensagemAguarde = '';
                this.mensagemErro =  'ERR:3321-'+mainService.catchPadrao(resp)
                erro = true
            });
          if (erro) 
            return;
          _params.comorbidades = resp.status == 200 ? resp.data : [];

          // DOENÇAS
          resp = await mainService.listaDoencas()
          .catch (err => {
              this.mensagemAguarde = '';
              this.mensagemErro =  'ERR:3320-' + mainService.catchPadrao(err)
              erro = true
          });
          if (erro) 
            return;
          _params.doencas = resp.status == 200 ? resp.data : [];

          this.$store.commit('salvaDadosPersistentes', _params)
        } else {
          this.$store.commit('carregaDadosPersistentes', _param)
        }
        //const _param2 = {sintomas: _sintomas, comorbidades: _comorbidades}
        //this.$store.commit('setaListaComuns', _param2)
        this.$store.commit('finalizaLogin', true)
        this.$router.push('/Home')
      }
    }
  }
</script>