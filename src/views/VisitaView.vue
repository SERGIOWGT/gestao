<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <v-flex >
            <IdentificaCidadao 
                v-show="operacaoAtual == enumOperacao.pesquisa"
                @cbNovaVisita= 'novaVisita'
                @cbEditaCidadao='editaCidadao'
            /> 
            <CadastraVisita
                v-if="operacaoAtual == enumOperacao.cadastroVisita"
                :pacienteId='pacienteId'
                @cbFimCadastro='fimCadastroVisita'
            />
            <CadastraCidadao 
                v-if="operacaoAtual == enumOperacao.cadastroCidadao"
                :pacienteId='pacienteId'
                @cbFimCadastro='fimCadastroCidadao'
            />
        </v-flex>
    </v-container>
</template>
<script>
    import IdentificaCidadao from '../components/VisitaIdentificaCidadao';
    import CadastraVisita from '../components/VisitaCadastra';
    import CadastraCidadao from '../components/CidadaoCadastra';
    import MessageBox from '../lastec.components/lastec-messagebox'

    export default {
        components: {
            IdentificaCidadao, CadastraCidadao, CadastraVisita, MessageBox
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

                if (volta == false) 
                    this.mensagemSucesso = 'Cidadão ' + (this.pacienteId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' 
            },
            fimCadastroVisita(volta) {
                this.operacaoAtual = this.enumOperacao.pesquisa

                if (volta == false) 
                    this.mensagemSucesso = 'Visita incluída com sucesso!' 
            }
        }
    }
</script>