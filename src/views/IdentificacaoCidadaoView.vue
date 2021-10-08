<template>
    <v-container fluid style="height: 100vmax;" class="pa-0">
      <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>       
      <v-flex >
        <IdentificacaoCidadao 
            v-show="etapaAtual == enumEtapa.emPesquisa"
            @cbNovoCidadao= 'novoCidadao'
            @cbEditaCidadao='editaCidadao'
        /> 
        <CadastraCidadao 
            v-if="etapaAtual == enumEtapa.emCadastro"
            :pacienteId='pacienteId'
            @cbNovoCadastro='novoCidadao'
            @cbFimCadastro='fimCadastro'
        />
      </v-flex>
    </v-container>
</template>
<script>
    import IdentificacaoCidadao from '../components/CidadaoIdentifica';
    import CadastraCidadao from '../components/CidadaoCadastra';
    import MessageBox from '../lastec.components/lastec-messagebox'
    
    export default {
        name: 'identificacaoCidadao',
        components: {IdentificacaoCidadao, CadastraCidadao, MessageBox},
        data() {
          return {

            pacienteId: 0,

            enumEtapa: {
              emPesquisa: 0,
              emCadastro: 1
            },
            etapaAtual: 0,

            // dados
            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

          }
        },
        computed: {
          mensagemSucesso: {
              get: function() { return this.mensagem},
              set: function(val) {
                  this.tipoMensagem = 0
                  this.mensagem = val
              }
          },
        },
        methods: {
          novoCidadao() {
            this.pacienteId = 0
            this.etapaAtual = this.enumEtapa.emCadastro
          },
          editaCidadao(id) {
            this.etapaAtual = this.enumEtapa.emCadastro
            this.pacienteId = id
          },
          fimCadastro(volta) {
            if (volta == false) {
              this.mensagemSucesso = 'Cidadão ' + (this.pacienteId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' 
            } 
              
            this.etapaAtual = this.enumEtapa.emPesquisa
          }
        }
    }
</script>
<style scoped>
  .paragrafo1 {
    padding: 0px;
    margin: 0px;
  }
  .input__label {
    color: blue;
  }
  .nota_texto {
    color:goldenrod;
    font-weight: bold;
    font-style: italic;
  }
  .nota_botao {
    color:primary;
    font-weight: bold;
  }
  .obs_campo {
    margin-top: 20px;
    color:green;
    font-size: 0.6rem;
    font-weight: bold;
  }
  
  @media(max-width: 2000px) {
    display-1 {font-size: 0.8rem}
    display-2 {font-size: 0.8rem}
    body-2 {font-size: 0.8rem}
    p {font-size: 0.8rem}
    h2 {font-size: 1.2rem}
    h4 {font-size: 0.9rem}
    .v-text-field input {
      font-size: 5.2em;
    }
    .v-combobox-field {
     font-size: 2.2em;
    }
  }
  .right-input input {
    text-align: right
  }
</style>

