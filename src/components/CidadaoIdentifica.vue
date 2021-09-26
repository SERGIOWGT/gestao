<template>
    <v-flex>
        <BasicDialog :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem" /> 
        <v-expansion-panels focusable class="mt-0" v-model="areaPesquisaAberta">
            <v-expansion-panel>
            <v-expansion-panel-header>
                <v-row no-gutters>
                    <v-col cols="12">
                    <b>Pesquisa por nome</b>
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
                <v-row>
                    <v-col cols="12" class="px-2 pb-0 pt-4">
                        <p class="paragrafo1">
                        Preencha pelo menos um campos abaixo e clique no <span class="nota_botao">botão pesquisar</span>.
                        </p>
                        <v-form ref="form" class="mx-2" v-model="formularioValido">
                            <v-autocomplete class="pt-5"
                                dense
                                placeholder="Nome do Cidadão"
                                clearable
                                :items="pacientes"
                                :search-input.sync="sincronizaPaciente"
                                item-value="id"
                                item-text="nome"
                                hide-no-data
                                :loading="isLoading"
                                v-model="infoPaciente.id"
                            ></v-autocomplete>
                            <v-text-field class="pt-3" 
                                dense clearable
                                label="Número do Sus"
                                v-model="infoPaciente.cartaoSUS"
                                v-mask="'### #### #### ####'"
                                :rules="[regras.NumeroSus.valido(false)]"
                            ></v-text-field>
                            <v-text-field class="pt-3"
                                dense clearable
                                label="CPF"
                                v-model="infoPaciente.cpf"
                                v-mask="'###.###.###-##'" 
                                :rules="[regras.Cpf.valido(false)]"
                            ></v-text-field>
                            <v-text-field class="pt-3" 
                                dense clearable 
                                label="Data de Nascimento"
                                v-model="infoPaciente.dataNascimento"
                                v-mask="'##/##/####'"
                                :rules="[regras.Data.valida(false)]"
                            ></v-text-field>
                            <v-text-field class="pt-3" @keypress="entradaCelular($event)"
                                dense clearable
                                label="Celular"
                                v-model="infoPaciente.celular"
                                :rules="[regras.Celular.valido(false)]"
                                maxlength="13"
                            ></v-text-field>
                        </v-form>
                    </v-col>
                </v-row>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text color="green" @click="novo()"> Novo Cidadão </v-btn>
                    <v-btn text color="secondary" @click="fechaPainel()"> Fecha </v-btn>
                    <v-btn text color="primary" :disabled="!pesquisaLiberada || isLoadingGrid" @click="listaPesquisa()"> Pesquisa </v-btn>
                </v-card-actions>
            </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
        <v-card flat class="pt-0 mt-5" tile v-if="pesquisaPronta" >
            <v-list three-line>
                <v-subheader class="justify-center px-0">
                    <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="3" >
                        <v-row justify="end">
                            <v-btn icon color="green" @click="novo()"><v-icon>mdi-plus-circle</v-icon></v-btn>
                            <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                        </v-row>
                    </v-col> 
                </v-subheader>
                <v-divider></v-divider>
                <v-list-item-group v-model="pacienteIdSelecionado" color="primary" >
                    <v-flex v-for="(item) in resultadoPesquisa" :key="item.id">
                    <v-list-item >
                        <v-list-item-content>
                            <v-list-item-title v-html="item.nome"></v-list-item-title>
                            <v-list-item-subtitle v-html="item.nomeMae"></v-list-item-subtitle>
                            <v-list-item-subtitle v-html="linha(2, item.dataNascimento)"></v-list-item-subtitle>
                            <v-list-item-subtitle v-html="linha(3, item.cartaoSUS)"></v-list-item-subtitle>
                            <v-list-item-subtitle v-html="linha(4, item.cpf)"></v-list-item-subtitle>
                             <v-list-item-subtitle v-html="item.nomeEstadoSaude"></v-list-item-subtitle>
                        </v-list-item-content>
                        <v-btn icon color="primary" @click="edita(item.id)"><v-icon>mdi-dots-vertical</v-icon></v-btn>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-flex>
</template>
<script>
    import mainService from '../services/MainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import entradaText from '../bibliotecas/entradaText'
    import rotinas from '../rotinasProjeto/salvaPacienteSintomas'
    import store from '../store'
    import BasicDialog from '../components/BasicDialog';
    import {rotinasBasicDialog} from '../rotinasProjeto/rotinasProjeto'

  export default {
    props: {
      mostra: Boolean,
    },
    components: {BasicDialog},
    data() {
          return {
            // funcoes
            entradaCpf: entradaText.cpf,
            regras: regrasCampos,

            // dados
            infoDialog: {
              tipo: 0,
              mensagem: ''
            },

            areaPesquisaAberta: 0,
            pesquisaPronta: false,
            formularioValido: false,
            isLoading: false,
            isLoadingGrid: false,
            cidadeId: 0,
            pacienteIdSelecionado: 0,
            pacientes: [],
            infoPaciente: {
                id: 0,
                parteNome: '',
                cpf: '01834522757',
                dataNascimento: '03/11/1971',
                numeroSus: '',              
                celular: ''
            },
            resultadoPesquisa: []
          }
        },
        created() {
            this.cidadeId = store.getters.cidadeId
        },
        computed: {
            pesquisaLiberada () {
                return this.formularioValido && ((this.infoPaciente.id != 0) || !this.isEmpty(this.infoPaciente.cpf) || !this.isEmpty(this.infoPaciente.numeroSus) || !this.isEmpty(this.infoPaciente.celular) || !this.isEmpty(this.infoPaciente.dataNascimento))
            },
            sincronizaPaciente: {
                get () {
                    return ''
                },
                set (searchInput) {
                    if ((searchInput) && (searchInput.length >= 3)) {
                        this.listaPaciente(this.cidadeId, searchInput)
                    } else 
                        this.pacientes = []
                }
            },
            tituloLista: function() {
                const _numeroRegistros = this.resultadoPesquisa.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : ` Lista de cidadãos (${_numeroRegistros}) `
            },
        },
        methods: {
            novo() {
                this.$emit('cbNovoCidadao')
            },
            edita(id) {
                this.infoPaciente.id = id
                this.$emit('cbEditaCidadao', id)
            },
            refresh() {
                alert('refresh')
            },
            linha(tipo, value){
                if (tipo == 2) {
                    const _dataNascimento = this.isEmpty(value) ? '' : value.replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$3-$2-$1') // eslint-disable-line
                    return `<b>Nascimento:</b><span class="nota_botao">&nbsp;${_dataNascimento}</span></span> `
                } else if (tipo == 3) {
                    const _numeroSus = this.isEmpty(value) ? '' : value.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4') // eslint-disable-line 
                    return `<b>Cartão SUS:</b><span class="nota_botao">&nbsp;${_numeroSus}</span>`
                } else if (tipo == 4) {
                    const _cpf = this.isEmpty(value) ? '' : value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // eslint-disable-line
                    return `<b>CPF:</b><span class="nota_botao">&nbsp;${_cpf}</span> `
                }
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            fechaPainel () {
                this.areaPesquisaAberta = null
            },
            async listaPaciente(cidadeId, parteNome) {
                const resp = await rotinas.listaPacientePorNome(cidadeId, parteNome)
                if (resp.status == 200) 
                    this.pacientes = resp.data
                else 
                    this.pacientes = []
            },
            async listaById(pacienteId) {
                
                this.isLoadingGrid = true
                rotinasBasicDialog.mensagemBusca(this.infoDialog, 'Consultando dados do cidadão! Aguarde...')
                await mainService.listaPaciente(pacienteId)
                .then((resp) => {
                    this.isLoadingGrid = false
                     rotinasBasicDialog.mensagemBusca(this.infoDialog, '')
                    if (resp.status == 200) {
                        this.resultadoPesquisa = resp.data
                        this.pesquisaPronta = true
                        this.fechaPainel()
                    } else {
                        rotinasBasicDialog.mensagemErro(this.infoDialog, resp.message)
                    }
                })
                .catch((resp) => {
                    this.isLoadingGrid = false; rotinasBasicDialog.mensagemErro(this.infoDialog, mainService.catchPadrao(resp))
                })
            },
            async listaByParams() {
                let param = {}
                param.cidadeId = this.cidadeId
                param.tipo = 1
                param.numeroSus = (this.infoPaciente.numeroSus == null) ? '' : this.infoPaciente.numeroSus
                param.cpf = (this.infoPaciente.cpf == null) ? '' : this.infoPaciente.cpf.replace(/\.|\-/g, '') // eslint-disable-line
                param.dataNascimento = (this.infoPaciente.dataNascimento == null) ? '' : this.infoPaciente.dataNascimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1') // eslint-disable-line
                param.celular = (this.infoPaciente.celular == null) ? '' : this.infoPaciente.celular

                this.isLoadingGrid = true
                rotinasBasicDialog.mensagemBusca(this.infoDialog, 'Consultando dados do cidadão! Aguarde...')
                await mainService.listaPacientes(param)
                .then((resp) => {
                    this.isLoadingGrid = false
                    rotinasBasicDialog.mensagemBusca(this.infoDialog,'')
                    if (resp.status == 200) {
                        this.resultadoPesquisa = resp.data
                        this.pesquisaPronta = true
                        this.fechaPainel()
                    } else {
                        rotinasBasicDialog.mensagemErro(this.infoDialog, resp.message)
                    }
                })
                .catch((resp) => {
                    this.isLoadingGrid = false; rotinasBasicDialog.mensagemErro(this.infoDialog, mainService.catchPadrao(resp))
                })
            },
            listaPesquisa() {
                if (this.infoPaciente.id == 0)
                    this.listaByParams()
                else 
                    this.listaById(this.infoPaciente.id)
            }
        }
    }
</script>
