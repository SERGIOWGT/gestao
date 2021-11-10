<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>   
        <ProgressBar :mensagem="mensagemAguarde"/>     
        <v-flex>
            <IdentificaEncerraVisita
                v-show="operacaoAtual == enumOperacao.pesquisa"
                @cbEncerraVisita= 'cbEncerraVisita'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            /> 
            <EncerraVisita
                v-if="operacaoAtual == enumOperacao.encerraVisita"
                :visitaId='visitaId'
                @cbFimEncerraVisita='cbFimEncerraVisita'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            />
        </v-flex>
    </v-container>
</template>
<script>
    import IdentificaEncerraVisita from '../components/VisitaEncerraIdentifica';
    import EncerraVisita from '../components/VisitaEncerra';
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'

    export default {
        components: {
            EncerraVisita, IdentificaEncerraVisita,  MessageBox, ProgressBar
        },
        data() {
          return {
            enumOperacao: {
                pesquisa: 0,
                encerraVisita: 1
            },
            operacaoAtual: 0,
            visitaId: 0,

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: ''
          }
        },
        created() {
            this.$store.commit('habilitaUserbar', false)
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
            cbMensagemAguarde(msg) {
                this.mensagemAguarde = msg
            },
            cbMensagemErro(msg) {
                this.tipoMensagem = 1
                this.mensagem = msg
            },
            cbMensagemSucesso(msg) {
                this.tipoMensagem = 0
                this.mensagem = msg
            },
            cbEncerraVisita(visitaId) {
                this.visitaId = visitaId
                this.operacaoAtual = this.enumOperacao.encerraVisita
            },
            cbFimEncerraVisita(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa
                this.mensagemAguarde = ''

                if (volta == false) 
                    this.mensagemSucesso = 'Visita baixada com sucesso!' 
            }
        }
    }
</script>