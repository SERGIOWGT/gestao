<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <v-flex v-if="buscandoDados==false">
            <TituloPagina titulo="CONSULTA DE VISITA" @cbAnterior="fimCadastro(true)" />
            <v-expansion-panels focused class="pt-0 mt-2">
                <ExpansionVisitaCidadao :nome="infoCidadao.nome" :endereco="enderecoAtual" :nomeEstadoSaude="infoCidadao.nomeEstadoSaude" :nomeMicroArea="infoCidadao.nomeMicroArea"/>
                <br>
                <v-divider></v-divider>
                <ExpansionLista tipo="C" posTitulo="atuais" :lista="infoCidadao.comorbidades"  />
                <ExpansionLista tipo="S" posTitulo="no dia da visita" :lista="infoVisita.sintomas"  />
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui os dados da Visita</v-expansion-panel-header >
                    <v-expansion-panel-content>
                        <v-card flat tile>
                            <v-card-text class="pt-4 px-0">
                                <v-text-field  dense disabled label="Data da Visita" v-model="infoVisita.dataVisita" />
                                <v-text-field dense disabled label="Tipo da Visita" v-model="infoVisita.nomeTipoVisita"/>
                                <v-text-field dense disabled label="Ação" v-model="infoVisita.nomeAcaoVisita" />
                                <v-textarea auto-grow disabled label="Resumo" v-model="infoVisita.resumo" row-height="10" ></v-textarea>
                            </v-card-text>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import TituloPagina from '../components/TituloPagina'
    import ExpansionVisitaCidadao from '../components/ExpansionVisitaCidadao.vue'
    import ExpansionLista from '../components/ExpansionListaCeS.vue'

    export default {
        components: {
            ExpansionLista, TituloPagina, ExpansionVisitaCidadao
        },
        props: {
          visitaId: Number,
          pacienteId: Number,
        },
        data() {
          return {
            infoCidadao: {
                nome: '',
                nomeLogradouro: '',
                numeroEndereco: '',
                complementoEndereco: '',
                nomeMicroArea: '',
                nomeEstadoSaude: '',
                comorbidades:[]
            },
            infoVisita:  {
                data: '',
                nomeTipoVisita: '',
                NomeAcaoVisita: '',
                resumo: '',
                sintomas:[]
            },

            mensagemAguarde: '',
            mensagemErro: '',
            mensagemSucesso: '',

            buscandoDados: true
          }
        },
        async mounted() {
            this.buscandoDados = true
            await this.buscaDados(this.pacienteId, this.visitaId)
            this.buscandoDados = false
        },
        watch: {
            mensagemAguarde (val) {
                this.isLoading = (val == '') ? false : true
                this.$emit('cbMensagemAguarde', val)
            },
            mensagemErro (val) {
                this.$emit('cbMensagemErro', val)
            },
            mensagemSuccesso (val) {
                this.$emit('cbMensagemSucesso', val)
            }
        },
        computed: {
            enderecoAtual:  {
                get: function() { 
                    let _retorno = this.infoCidadao.nomeLogradouro + (this.infoCidadao.numeroEndereco ? ', ' + this.infoCidadao.numeroEndereco : '')
                    _retorno += (this.infoCidadao.complementoEndereco ? ' - ' + this.infoCidadao.complementoEndereco : '')
                    return _retorno
                },
                set: function() {
                }
            },
        },       
        methods: {
            async buscaDados(pacienteId, visitaId) {
                let erroBusca = false

                this.mensagemAguarde = 'Buscando informações da visita. Aguarde...'
                await mainService.listaVisita(visitaId)
                .then((_visita) => {
                    this.mensagemAguarde = ''                    
                     console.log('_visita', _visita)

                     if (_visita.status == 200) {
                        this.infoVisita.dataVisita = _visita.data.dataVisita;
                        this.infoVisita.nomeTipoVisita = _visita.data.nomeTipoRelatorioVisita;
                        this.infoVisita.nomeAcaoVisita = _visita.data.nomeAcaoVisita
                        this.infoVisita.resumo = _visita.data.relatorioVisita;

                        console.log('_visita.data.nomePaciente', _visita.data.nomePaciente)
                        this.infoCidadao.nome = _visita.data.nomePaciente
                        this.infoCidadao.nomeLogradouro = _visita.data.nomeLogradouro
                        this.infoCidadao.numeroEndereco = _visita.data.numeroEndereco
                        this.infoCidadao.complementoEndereco = _visita.data.complementoEndereco
                        this.infoCidadao.nomeMicroArea = _visita.data.nomeMicroArea
                        this.infoCidadao.nomeEstadoSaude = '_visita.data.nomeEstadoSaude'
                    }
                    else {
                        erroBusca = true
                        this.mensagemErro=_visita.message  
                    }
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                console.log('infoCidadao', this.infoCidadao)
                
                this.mensagemAguarde = 'Buscando comorbidades do cidadão. Aguarde...'
                await mainService.listaPacienteComorbidades(pacienteId)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    this.infoCidadao.comorbidades = resp.status == 200 ? resp.data : []
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }

                this.mensagemAguarde = 'Buscando sintomas do cidadão. Aguarde...'
                await mainService.listaPacienteSintomas(pacienteId)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    this.infoVisita.sintomas = resp.status == 200 ? resp.data : []
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }

            },
            fimCadastro (volta) {
                this.$emit('cbFimCadastro', volta)
            },
        }
    }
</script>
<style scoped>
  .nota_texto {
    color:goldenrod;
    font-weight: bold;
    font-style: italic;
  }
  .v-btn {
      color: lightslategray;
  }
</style>
