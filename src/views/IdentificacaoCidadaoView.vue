<template>
  <v-container  class="pt-0 mt-0"> 
    <v-container fluid style="height: 100vmax;" class="pa-1">
      <BasicDialog :mostra="infoDialog.mensagem != ''" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem"/> 
      <v-flex >
        <IdentificacaoCidadao 
            v-if="etapaAtual == enumEtapa.emPesquisa"
            @cbMensagemErro= 'mensagemErro'
            @cbMensagemBusca= 'mensagemBusca'
            @cbNovoCidadao= 'novoCidadao'
            @cbEditaCidadao='editaCidadao'
        /> 
        <CadastraCidadao 
            v-if="etapaAtual == enumEtapa.emCadastro"
            :pacienteId='pacienteId'
            @cbMensagemErro= 'mensagemErro'
            @cbMensagemBusca= 'mensagemBusca'
            @cbFimCadastro='fimCadastro'
        />
      </v-flex>
    </v-container>
  </v-container>
</template>
<script>
    import BasicDialog from '../components/BasicDialog';
    import IdentificacaoCidadao from '../components/CidadaoIdentifica';
    import CadastraCidadao from '../components/CidadaoCadastra';
    import store from '../store'
    
    export default {
        name: 'identificacaoCidadao',
        components: {BasicDialog, IdentificacaoCidadao, CadastraCidadao},
        data() {
          return {

            pacienteId: 0,

            enumEtapa: {
              emPesquisa: 0,
              emCadastro: 1
            },
            etapaAtual: 0,

            // dados
            infoDialog: {
              tipo: 0,
              mensagem: ''
            },
          }
        },
        created() {
            this.cidadeId = store.getters.cidadeId
        },
        computed: {
        },
        methods: {
          novoCidadao() {
            console.log('novoCidadao-View')
            this.pacienteId = 0
            this.etapaAtual = this.enumEtapa.emCadastro
          },
          editaCidadao(id) {
            console.log('editaCidadao-View', id, this.enumEtapa.emCadastro)
            this.etapaAtual = this.enumEtapa.emCadastro
            this.pacienteId = id
          },
          mensagemBusca(msg) {
            console.log('mensagemBusca-View', msg)
            this.infoDialog.tipo = 0
            this.infoDialog.mensagem = msg
          },
          mensagemErro(msg) {
            console.log('mensagemErro-View', msg)
            this.infoDialog.tipo = 1
            this.infoDialog.mensagem = msg
          },
          fimCadastro() {
            console.log('fimCadastro')
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

