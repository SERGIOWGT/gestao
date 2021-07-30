<template class="px-0 mx-0">
  <v-container class="pa-0 ma-0" v-if="mostra">
     <v-flex>
      <v-layout column >
       <v-flex class="mt-0" fill-height>
       </v-flex>
          <v-flex fill-height >
             <v-card elevation="6" outlined tile>
              <v-card-title class="black white--text  justify-center"><h4>ENTRE COM AS SUAS CREDENCIAIS</h4></v-card-title>
              <v-card-text class="pa-3">
                <v-form class="my-2" v-model="formularioValido">
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
                  <v-row class="linha-padrao justify-center mx-0 my-5" >
                      Esqueceu a senha?&nbsp;<a href="#" v-on:click="showScheduleForm=true">Clique aqui para recuperá-la</a>
                  </v-row>
                  <v-row class="linha-padrao justify-center" >
                      <v-btn :loading="isLoading" class="black white--text" v-on:click="autentica()">Entrar</v-btn>
                  </v-row>
                  <v-row class="linha-padrao justify-center" >
                    <v-alert type="error" smaller dense outlined v-if="mensagemErro">
                        {{mensagemErro}}
                    </v-alert>
                  </v-row> 
                  <v-row class="linha-padrao justify-center mx-0 mt-5 mb-2" >
                      <div> <h3>ou entrar com </h3></div>
                  </v-row>
                  <v-row class="mt-2 mb-1 justify-center" >
                    <v-btn class="" disabled>
                      <v-icon color="blue darken-2" left>mdi-facebook</v-icon> Facebook
                    </v-btn>
                  </v-row>
                  <v-row class="mt-2 mb-1 justify-center" >
                    <v-btn v-google-signin-button="clientId" class="error" :disabled="true">
                      <v-icon color="white darken-2" left>mdi-google</v-icon> Google
                    </v-btn>
                  </v-row>  
                  <v-row class="linha-padrao justify-center px-y my-5" v-if="permiteRegistroUsuario">
                    Sua primeira vez?&nbsp;<a href="#" class="ml-1" v-on:click="registraUsuario"> Crie aqui seu usuário</a>
                  </v-row>
                </v-form>
              </v-card-text>
<!--               <v-card-actions v-if="permiteRegistroUsuario" class="card-action">
                <v-row class="justify-center">
                  Sua primeira vez?&nbsp;<a href="#" class="ml-1" v-on:click="registraUsuario"> Clique aqui para criar seu usuário</a>
                </v-row>
              </v-card-actions>
 -->              </v-card>
          </v-flex>
          <EsqueceuSenha 
            :visible="showScheduleForm" 
            :tamanhoMaximo="500" 
            :email="email" 
            :tokenSistema="tokenSistema"
            @close="showScheduleForm=false" />
      </v-layout>
    </v-flex>
  </v-container>
</template>
<script>
  import EsqueceuSenha from './EsqueceuSenha'
  import LoginService from '../services/loginService'
  import RotinasLogin from '../bibliotecas/rotinasLogin'

  export default {
    name: 'LasTec.LoginForm',
    props: {
      tokenSistema: String,
      urlImagemLogin: String,
      mostra: Boolean,
      tamanhoMinimoSenha: Number,
      tamanhoMaximoSenha: Number,
      nomeChave: String,
      formatoChave: String,
      formatoSenha: String,
      mensagemErroFormatoSenha: String,
      permiteRegistroUsuario: Boolean
    },
    components:{
      EsqueceuSenha
    },
    data() {
      return {
        clientId: '422976346721-ne6k3s5jibbqcvq4opmvacntcd891p8f.apps.googleusercontent.com',

        // Variaveis locais      
        visible: false, 
        showScheduleForm: false,
        showFormTrocaSenha: false,
        dialogProgress: true,
        formularioValido: false, 
        lembraMe: false,
        isLoading: false,
        senhaNaoVisivel: false,
        email: 'sergiowgt@gmail.com',
        senha: 'Bbm@2007',
        mensagemErro: '',
        rotinasLogin: RotinasLogin
      }
    },
    mounted: function() {
      console.log('LoginFormx', this.formatoSenha);
    },
    methods: {
      autentica() {
        this.isLoading =true;
        this.mensagemErro = ""
        console.log('entrei no autentica', this.tokenSistema, this.email, this.senha)
        LoginService.autentica(this.tokenSistema, this.email, this.senha)
          .then(resposta => {
            let _resposta = {
              email: this.email,
              usuarioId: resposta.data.usuarioId,
              token: resposta.data.token,
              nomeUsuario: resposta.data.nomeUsuario
            }
            this.$emit('autenticado', _resposta)
          })
          .catch((response) => {
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
          .finally(this.isLoading = false) 
        console.log('sai no autentica')
      },
      OnGoogleAuthSuccess (idToken) {
        console.log("OK", idToken)
      },
      OnGoogleAuthFail (error) {
        console.log("erro", error)
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
<style scoped>
  .google-signin-button {
    color: white;
    background-color: red;
    height: 50px;
    font-size: 16px;
    border-radius: 10px;
    padding: 10px 20px 25px 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

  .botao-arredondado{
      width: 70%;
      border-radius:15px!important;
  } 
  .linha-padrao {
    margin-top: 10px;
    align: 'center';
    justify:'center'
  }
  .linha-botao-2 {
    margin-top: 10px;
  }
  .v-btn{
      width: 90%;
  } 
  .v-alert{
    width: 90%;
    font-size: 0.8em;
  } 
  .v-card-text {
    padding: 5px;
  }
  .card-action {
    background-color: beige;
    font-size: 0.8em;
  }
  .esqueci-senha {
    color: blue;
    text-align: end;
    width: 100%;
    font-size: 0.8em;
  }

  @media(max-width: 375px) {
    h4 {font-size: 0.9rem}
  }
</style>