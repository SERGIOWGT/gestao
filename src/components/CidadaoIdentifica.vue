<template>
    <v-container fluid style="height: 100vmax;" class="pa-2">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <v-subheader class="justify-center px-0">
            <v-col class="px-1 teal--text" cols="10">
                <v-row justify="end"><b>CONSULTA PARA CADASTRO DE CIDADÃO</b></v-row>
            </v-col>                    
            <v-col cols="2" >
                <v-row justify="end"><v-btn icon color="teal lighten-2" @click="novo()"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                </v-row>
            </v-col> 
        </v-subheader>
        <v-expansion-panels focusable class="pt-0 mt-0 " v-model="areaPesquisaAberta">
            <v-expansion-panel default>
                <v-expansion-panel-header class="blue-grey lighten-5 teal--text px-3">
                    <v-row no-gutters>
                        <v-col cols="12">
                        PESQUISA POR NOME
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
                    <v-autocomplete class="pt-1"
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
                    <v-card-actions class="pt-2 pb-0">
                        <v-spacer></v-spacer>
                        <v-btn text small color="secondary" @click="fechaPainel()"> Limpar </v-btn>
                        <v-btn text small color="teal lighten-2" :disabled="!pesquisaPorNomeLiberada || isLoadingGrid" @click="listaPesquisa()"> Buscar </v-btn>
                    </v-card-actions>
                </v-expansion-panel-content>
            </v-expansion-panel>
            <v-expansion-panel class="mt-2">
                <v-expansion-panel-header class="blue-grey lighten-5 teal--text px-3">
                    <v-row no-gutters>
                        <v-col cols="12">
                        PESQUISA POR DADOS CADASTRAIS
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
                <v-expansion-panel-content >
                    <v-row>
                        <v-col cols="12" class="px-1 pb-0 pt-4">
                            <p class="subtitle-2">
                            Preencha pelo menos um dos campos abaixo e clique no botão <span class="blue--text">CONFIRMA</span>.
                            </p>
                            <v-form ref="form" class="mx-0" v-model="formularioValido">
                                <v-text-field class="pt-3" 
                                    dense clearable
                                    label="Número do SUS"
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
                            </v-form>
                        </v-col>
                    </v-row>
                    <v-card-actions class="pt-5 pb-0">
                        <v-spacer></v-spacer>
                        <v-btn text small color="secondary" @click="fechaPainel()"> Limpar </v-btn>
                        <v-btn text small color="teal lighten-2" :disabled="!pesquisaOutrosLiberada || isLoadingGrid" @click="listaPesquisa()"> Buscar </v-btn>
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
                            <v-btn icon color="teal lighten-2" @click="novo()"><v-icon>mdi-account-plus-outline</v-icon></v-btn>
                            <v-btn icon color="teal lighten-2" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
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
                        <v-btn icon color="teal lighten-2" @click="edita(item.id)"><v-icon>mdi-account-cog-outline</v-icon></v-btn>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import entradaText from '../bibliotecas/entradaText'
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'

  export default {
    props: {
      mostra: Boolean,
    },
    components: {ProgressBar, MessageBox},
    data() {
          return {
            // funcoes
            entradaCpf: entradaText.cpf,
            regras: regrasCampos,

            areaPesquisaAberta: 0,
            pesquisaPronta: false,
            formularioValido: false,
            isLoading: false,
            isLoadingGrid: false,
            pacienteIdSelecionado: 0,
            pacientes: [],
            infoPaciente: {
                id: 0,
                parteNome: '',
                cpf: '',
                dataNascimento: '',
                cartaoSUS: ''
            },
            resultadoPesquisa: [],
            
            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            cidadePadrao: null,
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
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
            pesquisaPorNomeLiberada () {
                return (this.infoPaciente.id != 0) 
            },
            pesquisaOutrosLiberada () {
                return this.formularioValido && (!this.isEmpty(this.infoPaciente.cpf) || !this.isEmpty(this.infoPaciente.cartaoSUS) || !this.isEmpty(this.infoPaciente.dataNascimento))
            },
            sincronizaPaciente: {
                get () {
                    return ''
                },
                set (searchInput) {
                    if ((searchInput) && (searchInput.length >= 3)) {
                        this.listaPacientePorNome(this.cidadePadrao.id, searchInput)
                    } else 
                        this.pacientes = []
                }
            },
            tituloLista: function() {
                const _numeroRegistros = this.resultadoPesquisa.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um cidadão retornado na pesquisa  ` : ` ${_numeroRegistros} cidadãos retornados`
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
                this.listaPesquisa()
            },
            linha(tipo, value){
                if (tipo == 2) {
                    const _dataNascimento = this.isEmpty(value) ? '' : value.replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$3-$2-$1') // eslint-disable-line
                    return `<b>Nascimento:</b><span class="nota_botao">&nbsp;${_dataNascimento}</span></span> `
                } else if (tipo == 3) {
                    const _cartaoSUS = this.isEmpty(value) ? '' : value.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4') // eslint-disable-line 
                    return `<b>Cartão SUS:</b><span class="nota_botao">&nbsp;${_cartaoSUS}</span>`
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
            async listaPacientePorNome(cidadeId, parteNome) {
                const param = {cidadeId: cidadeId, nome: parteNome}
                const resp = await mainService.listaPacientes(param)
                this.isLoading = true
                if (resp.status == 200) 
                    this.pacientes = resp.data
                else 
                    this.pacientes = []
                this.isLoading = false
            },
            async listaById(pacienteId) {
                this.isLoadingGrid = true
                this.mensagemAguarde =  'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPaciente(pacienteId)
                .then((resp) => {
                    this.isLoadingGrid = false
                     this.mensagemAguarde =  ''
                    if (resp.status == 200) {
                        this.resultadoPesquisa = resp.data
                        this.pesquisaPronta = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro =  resp.message
                    }
                })
                .catch((resp) => {
                    this.isLoadingGrid = false; this.mensagemErro =  mainService.catchPadrao(resp)
                })
            },
            async listaByParams() {
                let param = {}
                param.cidadeId = this.cidadePadrao.id
                param.cartaoSUS = (this.infoPaciente.cartaoSUS == null) ? '' : this.infoPaciente.cartaoSUS.replace(/\s/g, '')
                param.cpf = (this.infoPaciente.cpf == null) ? '' : this.infoPaciente.cpf.replace(/\.|\-/g, '') // eslint-disable-line
                param.dataNascimento = (this.infoPaciente.dataNascimento == null) ? '' : this.infoPaciente.dataNascimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1') // eslint-disable-line

                this.isLoadingGrid = true
                this.mensagemAguarde =  'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPacientesCompleta(param)
                .then((resp) => {
                    this.isLoadingGrid = false
                    this.mensagemAguarde = ''
                    if (resp.status == 200) {
                        this.resultadoPesquisa = resp.data
                        this.pesquisaPronta = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro =  resp.message
                    }
                })
                .catch((resp) => {
                    this.isLoadingGrid = false; this.mensagemErro =  mainService.catchPadrao(resp)
                })
            },
            listaPesquisa() {
                if ((this.infoPaciente.id == 0) || (this.infoPaciente.id == null))
                    this.listaByParams()
                else 
                    this.listaById(this.infoPaciente.id)
            }
        }
    }
</script>
<style scoped lang="scss">
    .paragrafo1 {
        padding: 0px;
        margin: 0px;
    }
</style>