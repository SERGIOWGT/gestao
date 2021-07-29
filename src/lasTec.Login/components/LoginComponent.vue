<template>
  <v-container fluid  pa-0>
    <ProgressDialog :mensagem="'Aguarde um momento....'" :mostra="!sistemaChecado"/>
    <LoginForm  
      :mostra="sistemaChecado"
      :tokenSistema="tokenSistema" 
      :urlImagemLogin="urlImagemLogin"
      :permiteRegistroUsuario="permiteRegistroUsuario"
      :tamanhoMinimoSenha="senhaDefinicao.tamanhoMinimo"
      :tamanhoMaximoSenha="senhaDefinicao.tamanhoMaximo"
      :nomeChave="chaveDefinicao.nome"
      :formatoChave="chaveDefinicao.formato"
      :formatoSenha="senhaDefinicao.formato"
      :mensagemErroFormatoSenha="senhaDefinicao.mensagemErroFormato"
      @autenticado='autenticado'
      @registraUsuario='registraUsuario'
      @trocaSenha='trocaSenha'
    />
  </v-container>
</template>

<script>
  import LoginService from '../services/loginService'
  import LoginForm from './LoginForm'
  import ProgressDialog from './ProgressBar'

  export default {
    name: 'LasTec.Login',
    props: {
      tokenSistema: String
    },
    components:{
      LoginForm, ProgressDialog
    },
    data() {
      return {
        urlImagemPrefeitura: 'https://www.guarara.mg.gov.br/wp/wp-content/uploads/2021/06/BRASAO.png',
        sistemaChecado: false,
        sistemaId: 0,
        urlImagemLogin: '',
        permiteRegistroUsuario: false,
        chaveDefinicao: {
          nome: '',
          formato: ''
        }, 
        senhaDefinicao: {
          tamanhoMaximo: 10,
          tamanhoMinimo: 6,
          formato: '',
          mensagemErroFormato: ''
        }
      }
    },
    mounted: function() {
      this.load();
    },
    methods: { 
      load() {
        LoginService.listaConfiguracao(this.tokenSistema)
          .then(resposta => {
            console.log('listaConfiguracao', resposta); 
            this.sistemaId =  resposta.data.sistemaId;
            this.permiteRegistroUsuario = resposta.data.permiteRegistroUsuario;
            this.urlImagemLogin = resposta.data.urlImagemLogin;
            this.chaveDefinicao.nome = resposta.data.nomeChave;
            this.chaveDefinicao.formato = resposta.data.formatoChave;
            this.senhaDefinicao.tamanhoMaximo =  resposta.data.tamanhoMaximoSenha;
            this.senhaDefinicao.tamanhoMinimo = resposta.data.tamanhoMinimoSenha;
            this.senhaDefinicao.formato = resposta.data.formatoSenha;
            this.senhaDefinicao.mensagemErroFormato = resposta.data.mensagemErroFormatoSenha;
            this.sistemaChecado = true; 

            let dadosSistema = {
              sistemaId: this.sistemaId,
              nomeSistema: resposta.data.nomeSistema,
              plataformaId: this.plataformaId,
              nomePlataforma: resposta.data.nomePlataforma,
              urlImagemLogin: this.urlImagemLogin,
              tamanhoMaximoSenha: this.senhaDefinicao.tamanhoMaximo,
              tamanhoMinimoSenha: this.senhaDefinicao.tamanhoMinimo,
              formatoSenha: this.senhaDefinicao.formato
            }
            this.$emit('setaConfiguracaoSistema', dadosSistema)
        })
      },
      autenticado(obj) {
         obj.sistemaId = this.sistemaId
         this.$emit('autenticado', obj)
      },
      registraUsuario() {
        this.$emit('registraUsuario')
      },
      trocaSenha() {
        this.$emit('trocaSenha')
      }
    }
  }
</script>
