<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <v-flex v-if="buscandoDados==false">
            <div style="text-align:center"><h4 class="teal--text ">CADASTRO DE VISITA</h4></div>
            <v-expansion-panels focused class="pt-0 mt-2">
                <v-expansion-panel>
                    <v-expansion-panel-header  class="blue-grey lighten-5 teal--text">
                        <v-row no-gutters>
                            <v-col cols="12">
                            <b>{{infoCidadao.nome}}</b>
                            </v-col>
                            <v-col
                            cols="1"
                            class="text--secondary"
                            >
                            <v-fade-transition leave-absolute>
                                <span
                                key="0"
                                >
                                </span>
                            </v-fade-transition>
                            </v-col>
                        </v-row>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-text-field 
                            disabled hide-details
                            label="Endereço"
                            v-model="enderecoAtual"
                        ></v-text-field >
                        <v-text-field 
                            disabled hide-details
                            label="Micro Área"
                            v-model="infoCidadao.nomeMicroArea"
                        ></v-text-field>
                        <v-text-field 
                            disabled hide-details
                            label="Estado de Saúde"
                            v-model="infoCidadao.nomeEstadoSaude"
                        ></v-text-field>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <br>
                <v-divider></v-divider>
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header v-if="infoCidadao.comorbidades.length == 0" hide-actions disabled class="blue-grey lighten-5 red--text text--lighten-1">Cidadão sem comorbidades</v-expansion-panel-header >
                    <v-expansion-panel-header v-else class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui as Comorbidades</v-expansion-panel-header >
                    <v-expansion-panel-content >
                        <v-flex class="px-0 pt-2" v-for="(item) in infoCidadao.comorbidades" :key="item.id" >
                            <v-chip> {{item.nome}} </v-chip>
                        </v-flex>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header v-if="infoUltimaVisita.id == 0" hide-actions disabled class="blue-grey lighten-5 red--text text--lighten-1">Essa é a primeira visita do cidadão</v-expansion-panel-header >
                    <v-expansion-panel-header v-else class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui a última visita</v-expansion-panel-header >
                    <v-expansion-panel-content>
                        <v-subheader class="px-0">{{tipoDataVisita}}</v-subheader>
                        <v-subheader  class="px-0">{{infoUltimaVisita.resumo}}</v-subheader>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Atualize aqui os Sintomas</v-expansion-panel-header>
                    <v-expansion-panel-content class="pt-2">
                        <v-flex class="px-0 pt-0 pb-5" v-for="(item, index) in infoVisita.sintomas" :key="item.id" >
                        <v-row class="pa-1"> 
                            <v-col cols="9" class="pa-0"> 
                                <v-checkbox  class="py-0" v-model="infoVisita.sintomas[index].selecionado" :label="item.nome"></v-checkbox>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field  class="py-0"  @focus="$event.target.select()" 
                                    dense hide-details
                                    type="number"
                                    label="dias"
                                    v-model="infoVisita.sintomas[index].dias"
                                    v-show="infoVisita.sintomas[index].selecionado == true"
                                    min=0
                                ></v-text-field> 
                            </v-col>
                        </v-row>
                        <v-divider></v-divider>
                        </v-flex>
                        <p>.</p>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-2">
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Faça aqui o registro da sua visita</v-expansion-panel-header>
                    <v-expansion-panel-content class="pt-2">
                        <v-form ref="form3" v-model="podeSalvar">
                            <v-text-field class="pt-2"
                                dense required clearable
                                label="Data da Visita*"
                                v-model="infoVisita.data"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(true)]"
                            ></v-text-field>
                            <v-autocomplete class="pt-2"
                                dense hide-no-data required
                                label="Tipo de Relatório*"
                                v-model="infoVisita.tipoRelatorio"
                                :items="tiposRelatoriosVisitas"
                                item-value="id"
                                item-text="nome"
                                return-object
                                :rules="[regras.Basicas.obrigatorio()]"
                            ></v-autocomplete> 
                            <v-textarea
                                auto-grow counter clearable
                                clear-icon="mdi-close-circle"
                                label="Relatório da visita*"
                                v-model="infoVisita.resumo"
                                maxlength="500"
                                row-height="10"
                                :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(500)]"
                            ></v-textarea>
                            <small>*campo obrigatório</small>
                        </v-form>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-flex class="pt-5">
            <BottomBar 
                    :temBotaoAnterior="true"
                    :temBotaoProximo= "false"
                    :temBotaoCancela= "false"
                    :temBotaoFinaliza= "false"
                    :temBotaoSalva= "true"
                    :temBotaoVerifica= "false"
                    :temBotaoNovo= "false"
                    :podeVoltar="true"
                    :podeContinuar= "false"
                    :podeCancelar= "false"
                    :podeVerificar= "false"
                    :podeSalvar="podeSalvar"
                    @funcaoRetorno= 'cmdBotao'
            />
            </v-flex>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import BottomBar from '../components/StepBottomBar'
    import {rotinasCadastraPaciente } from '../rotinasProjeto/rotinasProjeto'
    import formata from '../bibliotecas/formataValores'
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'

    export default {
        components: {
            ProgressBar, MessageBox, BottomBar
        },
        props: {
          pacienteId: Number,
        },
        data() {
          return {
            regras: regrasCampos,

            enumTipoPesquisa: {
              porNome: 0,
              porLocalidade: 1,
            },
            areaPesquisaAberta: 0,
            formularioValido: false,

            cidadePadrao: null,
            unidadeSaudePadrao: null,
            mnicroAreaPadrao: null,
            bairroPadrao: null,
            logradouroPadrao: null,
            podeSalvar: false,

            infoCidadao: {
                id: 0,
                nome: '',
                nomeLogradouro: '',
                numeroEndereco: '',
                complementoEndereco: '',
                nomeMicroArea: '',
                nomeEstadoSaude: '',
                sintomas: [],
                comorbidades:[]
            },
            tiposRelatoriosVisitas: [],

            infoVisita:  {
                id: 0,
                data: '',
                tipoRelatorio: '',
                resumo: '',
                sintomas:[]
            },
            infoUltimaVisita:  {
                id: 0,
                data: '',
                nomeTipoRelatorio: '',
                resumo: ''
            },

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            buscandoDados: true
          }
        },
        async mounted() {
            this.infoVisita.data = formata.dataDDMMYYYY(new Date())
            this.buscandoDados = true
            await this.listaPaciente(this.pacienteId)
            this.buscandoDados = false
        },
        watch: {
            mensagemAguarde (val) {
                this.isLoading = (val == '') ? false : true
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
            tipoDataVisita() {
                if (this.infoUltimaVisita.id == 0)
                    return ''
                    
                const str = formata.data(this.infoUltimaVisita.data.substring(0, 10))
                return `${this.infoUltimaVisita.nomeTipoRelatorio} em ${str}`
            },
        },       
        methods: {
            cmdBotao: function (value) {
                if (value == 'VO') {
                    this.fimCadastro(true)
                } else 
                    this.salvaVisita()
            },
            async listaPaciente(pacienteId) {
                let erroBusca = false

                this.mensagemAguarde = 'Buscando Tipo Relatório Visita! Aguarde...'
                await mainService.listaTipoRelatorioVisita()
                .then (resp => {this.tiposRelatoriosVisitas = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                 this.mensagemAguarde = 'Buscando informações do cidadão. Aguarde...'
                await mainService.listaPaciente(pacienteId)
                .then((_paciente) => {
                    this.mensagemAguarde = ''
                    if (_paciente.status == 200) {
                        this.infoCidadao.nome = _paciente.data[0].nome
                        this.infoCidadao.nomeLogradouro = _paciente.data[0].nomeLogradouro
                        this.infoCidadao.numeroEndereco = _paciente.data[0].nomeEndereco
                        this.infoCidadao.complementoEndereco = _paciente.data[0].complementoEndereco
                        this.infoCidadao.nomeMicroArea = _paciente.data[0].nomeMicroArea
                        this.infoCidadao.nomeEstadoSaude = _paciente.data[0].nomeEstadoSaude
                    }
                    else {
                        erroBusca = true
                        this.mensagemErro=_paciente.message  
                    }
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })

                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }

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
                    this.infoCidadao.sintomas = resp.status == 200 ? resp.data : []
                    const _todosSintomas = this.$store.getters.todosSintomas
                    this.infoVisita.sintomas = rotinasCadastraPaciente.ordenaSintomas(_todosSintomas, this.infoCidadao.sintomas)
                })
                .catch((response) => {
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                if (erroBusca)  {
                    this.mensagemAguarde = ''
                    return
                }
                
                this.mensagemAguarde = 'Buscando ultima visita. Aguarde...'
                await mainService.listaPacienteUltimaVisita(pacienteId)
                .then((resp) => {
                    this.mensagemAguarde = ''
                    if ((resp.status == 200) && (resp.data.length > 0)) {
                        const data = resp.data[0]
                        this.infoUltimaVisita.data = data.dataVisita
                        this.infoUltimaVisita.id = data.id
                        this.infoUltimaVisita.nomeTipoRelatorio = data.nomeTipoRelatorioVisita
                        this.infoUltimaVisita.resumo = data.relatorioVisita

                    } else {
                        this.infoUltimaVisita.data = ''
                        this.infoUltimaVisita.id = 0
                        this.infoUltimaVisita.nomeTipoRelatorio = ''
                        this.infoUltimaVisita.resumo = ''
                    }
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
            async salvaVisita() {
                this.mensagemAguarde = 'Salvando a visita. Aguarde...'

                const data = this.infoVisita.data.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1')  // eslint-disable-line
                const sintomas = this.infoVisita.sintomas.filter(e => e.selecionado === true);
                const params = {
                    pacienteId: this.pacienteId,
                    dataVisita: data,
                    tipoRelatorioVisitaId: this.infoVisita.tipoRelatorio.id,
                    relatorioVisita: this.infoVisita.resumo,
                    tipoSintomas: sintomas
                }
                await mainService.salvaVisita(this.infoVisita.id, params)
                .then(resp => {
                    if (resp.status != 200) {
                        this.mensagemErro = resp.message
                    } else {
                        this.mensagemAguarde = ''
                        this.fimCadastro(false)
                    }
                })
                .catch(err => {this.mensagemErro = mainService.catchPadrao(err); return;});
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
