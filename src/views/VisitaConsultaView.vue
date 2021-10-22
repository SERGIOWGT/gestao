<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <TituloPagina titulo="CONSULTA PARA VISITAS DO CIDADÃO" @cbAnterior="$router.back()"/>
        <PesquisaPorNome  :aberto="statusPainel==1" :habilitaPesquisa="!isLoadingGrid" cbAbriu="cbAbrePainelNome" @cbBusca="cbBuscaPorPacienteId"/>
        
        <v-card flat class="pt-0 mt-0" tile v-if="gridPronto" >
            <v-list subheaderthree-line>
                <v-subheader class="justify-center px-0">
                    <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="3" >
                        <v-row justify="end">
                            <v-btn icon color="teal lighten-2" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                        </v-row>
                    </v-col> 
                </v-subheader>

                <v-divider></v-divider>
                <v-list-item-group class="px-1">
                    <v-flex v-for="(item) in resultado" :key="item.id">
                            <v-row>
                                <v-col cols="10">
                                    <v-list-item-title>{{cabecalho(item.dataVisita, item.nomeTipoMotivoVisita)}}</v-list-item-title>
                                    <v-list-item-subtitle>{{item.nomeTipoMotivoVisitaAnalitico}}</v-list-item-subtitle>
                                    <v-list-item-subtitle>{{item.nomeAcaoVisita}}</v-list-item-subtitle>
                                </v-col>
                                <v-col cols="1" class="justify-center pt-6">
                                    <v-btn icon color="teal lighten-2" @click="consultaVisita(item.id)"><v-icon>mdi-account-cog-outline</v-icon></v-btn>
                                </v-col>
                            </v-row>
                        <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>

        <ConsultaVisita
            v-if="operacaoAtual == 1"
            :pacienteId='pacienteId'
            :visitaId='visitaId'
            @cbFimCadastro='fimConsultaVisita'
        />

    </v-container>
</template>
<script>
    //import mainService from '../services/mainService'
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'
    import PesquisaPorNome from '../components/PesquisaCidadaoPorNome'
    import TituloPagina from '../components/TituloPagina'
    import mainService from '../services/mainService'
    import ConsultaVisita from '../components/VisitaConsulta.vue'

    export default {
        components: {
            ProgressBar, MessageBox, PesquisaPorNome, TituloPagina, ConsultaVisita
        },
        data() {
          return {
            statusPainel: 1, //0-fechados; 
            isLoadingGrid: false,

            gridPronto: false,
                        
            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            operacaoAtual: 0,

            pacienteId: 0,
            visitaId: 0,
            nomePaciente: '',

            resultado: []

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
            tituloLista: function() {
                const _numeroRegistros = this.resultado.length
                return (_numeroRegistros == 0) ? 'Não há visitas para esse cidadão' : (_numeroRegistros == 1) ? ` Uma visita retornada na pesquisa  ` : ` ${_numeroRegistros} visitas retornadas`
            },
        },
        methods: {
            cbBuscaPorPacienteId (pacienteId, nomePaciente) {
                this.pacienteId = pacienteId;
                this.nomePaciente = nomePaciente
                this.listaVisitas();
            },
            consultaVisita(id) {
                this.visitaId = id;
                this.operacaoAtual = 1;
            },
            async listaVisitas () {
                this.gridPronto = false
                this.mensagemAguarde = 'Consultando visitas do cidadão! Aguarde...'
                await mainService.listaPacienteVisitas(this.pacienteId)
                .then(_resposta => {
                    this.mensagemAguarde = ''
                    console.log('view', _resposta)
                    if (_resposta.status == 200) {

                        this.resultado = _resposta.data
                        this.gridPronto = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro = _resposta.message
                    }
                    this.mensagemAguarde = '';
                })
                .catch((response) => {
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                
            },
            fechaPainel () {
                this.statusPainel = 0
            },

            cabecalho(data) {
                console.log(data, typeof(data));
                return '';

            },
            linha(tipo, value){
                let retorno = '';
                if (tipo == 1)
                    retorno = `<b>Ação:</b><span class="nota_botao">&nbsp;${value}</span></span> `
                else if (tipo == 2)
                    retorno = `<b>Solução:</b><span class="nota_botao">&nbsp;</span></span> `
                return retorno;
            },
            fimConsultaVisita() {
                this.operacaoAtual = 0;                
            }
        }
    }
</script>
