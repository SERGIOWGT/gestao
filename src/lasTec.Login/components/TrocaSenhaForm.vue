<template>
  <v-container>
     <v-flex >
      <v-layout column justify-space-between>
        <v-flex class="mt-5" fill-height>
        <v-img class="mt-0"
            :src="urlImagem"
            contain
            height="80"
          />
       </v-flex>
        <v-flex fill-height>
            <v-card  raised width="98%" class="mx-auto mt-3" > 
            <v-card-title class="justify-center cyan white--text dense" ><h4>TROCAR SENHA</h4></v-card-title> 
            <v-card-text class="px-5 py-5">
              <v-form class="ml-1 my-3 mr-1" v-model="formularioValido">
                <v-text-field
                  v-model="email"
                  :rules="rotinasLogin.EmailRules"
                  label="E-mail"
                  required
                  clearable
                  prepend-icon="mdi-account-circle"
                />
                <v-text-field 
                  label="Senha Atual"
                  clearable
                  v-model="senhaAtual"
                  :counter="tamanhoMaximoSenha"
                  :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha)]"
                  :type="!senhaNaoVisivel ? 'password' : 'text'"
                  prepend-icon="mdi-lock"
                  :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                  :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
                  @click:append="senhaNaoVisivel = !senhaNaoVisivel"
                />
                <v-text-field 
                  label="Nova Senha"
                  clearable
                  v-model="senhaNova"
                  :counter="tamanhoMaximoSenha"
                  :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha)]"
                  :type="!senhaNaoVisivel ? 'password' : 'text'"
                  prepend-icon="mdi-lock"
                  :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                  :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
                  @click:append="senhaNaoVisivel = !senhaNaoVisivel"
                />
                <v-text-field 
                  label="Confirmação da Nova Senha"
                  clearable
                  v-model="senhaNovaConfirmada"
                  :counter="tamanhoMaximoSenha"
                  :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha), ...SenhaConfirmacaoRules]"
                  :type="!senhaNaoVisivel ? 'password' : 'text'"
                  prepend-icon="mdi-lock"
                  :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                  :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
                  @click:append="senhaNaoVisivel = !senhaNaoVisivel"
                />
                <v-row class="linha-botao-2" >
                    <v-col>
                      <v-btn :loading="isLoading" color="warning white--text" v-on:click="cancelar">Fechar</v-btn>
                    </v-col>
                    <v-col class="justify-center">
                      <v-btn :disabled="!formularioValido" :loading="isLoading" class="teal white--text" v-on:click="trocaSenha()">Trocar Senha</v-btn>
                    </v-col>
                </v-row>
                <v-row class="linha-botao-2 justify-center" >
                  <v-alert class="mt-2" type="error" smaller dense outlined v-if="mensagemErro">
                      {{mensagemErro}}
                  </v-alert>
                </v-row> 
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
  </v-container>
</template>
<script>
  import LoginService from '../services/loginService'
  import RotinasLogin from '../bibliotecas/rotinasLogin'

  export default {
    name: 'LasTec.RegistraForm',
    props: {
      plataformaId: String,
      sistemaId: String,
      nomeSistema: String,
      urlImagem: String,
      tamanhoMinimoSenha: Number,
      tamanhoMaximoSenha: Number,
      formatoSenha: String
    },
    data() {
      return {
        formularioValido: false, 
        isLoading: false,
        email: 'sergiows.rs@gmail.com',
        senhaAtual: 'Sw@12',
        senhaNova: '',
        senhaNovaConfirmada: '', 
        senhaNaoVisivel: false,
        mensagemErro: '',
        rotinasLogin: RotinasLogin,
        SenhaConfirmacaoRules: [
            v => (v === this.senhaNova) || `Senhas não são idênticas`
        ]
      }
    },
    methods: {
      trocaSenha() {
        this.isLoading =true;
        this.mensagemErro = ""
        LoginService.trocaSenha(this.sistemaId, this.email, this.senhaAtual, this.senhaNova)
          .then(resposta => {
            let _resposta = {
              email: this.email,
              usuarioId: resposta.data.usuarioId,
              token: resposta.data.token,
              nomeUsuario: resposta.data.nomeUsuario
            }
            this.$emit('senhaTrocada', _resposta)
          })
          .catch((error) => {
              if (error.response) {
                this.mensagemErro = "";
                error.response.data.forEach(el => {
                  this.mensagemErro += el.mensagem;
                });
              } else if (error.request) {
                // The request was made but no response was received
                this.mensagemErro = error.request;
              } else {
                // Something happened in setting up the request that triggered an Error
                this.mensagemErro = error.message;
              }
          })
          .finally(this.isLoading = false) 
      },
      cancelar() {
        this.$emit('cancelar')
      }
    }
  }
</script>
<style scoped>
  .linha-botao-2 {
    margin-top: 10px;
  }
  .v-btn{
      width: 99%;
  } 
  .v-alert{
    width: 90%;
    font-size: 0.8em;
  } 
  .v-card-text {
    padding: 30px;
  }

</style>