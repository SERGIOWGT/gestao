<template>
<v-dialog v-model="mostra" :max-width="tamanhoMaximo">
  <v-card>
    <v-card-text class="px-5 py-5" >
      <div class="subtitle-2">Para receber sua senha por E-mail, preencha o campo abaixo e clique em enviar.</div>
      <v-form class="mt-5 pb-0 my-0" v-model="formularioValido" >
        <v-text-field
          clearable
          v-model="email"
          :rules="EmailRules"
          label="E-mail"
          required
          prepend-icon="mdi-email"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions class="text-right" justify-right >
      <v-btn color="red lighten-2" dark flat @click.stop="mostra=false">Fechar</v-btn>
      <v-btn :disabled="!formularioValido" color="primary" flat @click.stop="Envia()">Enviar</v-btn>
    </v-card-actions>
  </v-card>
</v-dialog>
</template>

<script>
import LoginService from '../services/loginService'

export default {
  props: ['visible', 'tamanhoMaximo', 'email', 'sistemaId'],
  computed: {
    mostra: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('close')
        }
      }
    }
  },
  data() {
    return {
      isLoading: false,
      formularioValido: false,
      EmailRules: [
        v => !!v || 'E-mail é obrigatório',
        v => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail inválido' // eslint-disable-line
      ]
    }
  },
  methods: {
    Envia()  {
        let ref = this;
        ref.isLoading =true;
        this.mensagemErro = ""
        LoginService.recuperaSenha(this.sistemaId, this.email)
          .then(resposta => {
            console.log(resposta.data)
            ref.mostra=false
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
          .finally(ref.isLoading = false)
      }
  }
    
}
</script>