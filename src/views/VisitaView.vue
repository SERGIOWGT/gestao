<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>   
        <ProgressBar :mensagem="mensagemAguarde"/>     
        <v-flex>
            <IdentificaVisita 
                v-show="operacaoAtual == enumOperacao.pesquisa"
                @cbNovaVisita= 'novaVisita'
                @cbEditaCidadao='editaCidadao'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            /> 
            <CadastraVisita
                v-if="operacaoAtual == enumOperacao.cadastroVisita"
                :pacienteId='pacienteId'
                @cbFimCadastro='fimCadastroVisita'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            />
            <CadastraCidadao 
                v-if="operacaoAtual == enumOperacao.cadastroCidadao"
                :pacienteId='pacienteId'
                @cbFimCadastro='fimCadastroCidadao'
                @cbMensagemAguarde='cbMensagemAguarde'
                @cbMensagemErro='cbMensagemErro'
                @cbMensagemSucesso='cbMensagemSucesso'
            />
        </v-flex>
    </v-container>
</template>
<script>
    import IdentificaVisita from '../components/VisitaIdentifica';
    import CadastraVisita from '../components/VisitaCadastra';
    import CadastraCidadao from '../components/CidadaoCadastra';
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'

    export default {
        components: {
            IdentificaVisita, CadastraCidadao, CadastraVisita, MessageBox, ProgressBar
        },
        data() {
          return {
            enumOperacao: {
                pesquisa: 0,
                cadastroVisita: 1,
                cadastroCidadao: 2
            },
            operacaoAtual: 0,
            pacienteId: 0,

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: ''
          }
        },
        created() {
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
            novaVisita(pacienteId) {
                this.pacienteId = pacienteId
                this.operacaoAtual = this.enumOperacao.cadastroVisita
            },
            editaCidadao(pacienteId) {
                this.pacienteId = pacienteId
                this.operacaoAtual = this.enumOperacao.cadastroCidadao
            },
            fimCadastroCidadao(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa
                this.mensagemAguarde = ''

                if (volta == false) 
                    this.mensagemSucesso = 'Cidadão ' + (this.pacienteId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' 
            },
            fimCadastroVisita(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa
                this.mensagemAguarde = ''

                if (volta == false) 
                    this.mensagemSucesso = 'Visita incluída com sucesso!' 
            }
        }
    }
</script>