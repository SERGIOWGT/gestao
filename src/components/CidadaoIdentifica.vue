<template>
    <v-flex>
<!-- AREA PESQUISA           -->
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
                    <v-btn text color="secondary" @click="fechaPainel()"> Fecha </v-btn>
                    <v-btn text color="primary" :disabled="!pesquisaLiberada || isLoadingGrid" @click="listaPesquisa(1)"> Pesquisa </v-btn>
                </v-card-actions>
            </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
<!-- AREA GRID         -->
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
                            <v-list-item-subtitle v-html="celulaLinha1(item.dataNascimento, item.cpf)"></v-list-item-subtitle>
                            <v-list-item-subtitle v-html="celulaLinha2(item.cartaoSUS)"></v-list-item-subtitle>
                            <v-list-item-subtitle v-html="'Nome da Mãe'"></v-list-item-subtitle>
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

  export default {
    props: {
      mostra: Boolean,
    },
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
                this.$emit('cbEditaCidadao', id)
            },
            refresh() {
                alert('refresh')
            },
            celulaLinha1(dataNascimento, cpf){
                const _dataNascimento = (dataNascimento == '') ? '' : dataNascimento.replace(/(\d{4})\-(\d{2})\-(\d{2})/, '$3-$2-$1') // eslint-disable-line
                const _cpf = (cpf == '') ? '' : cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4') // eslint-disable-line
               
                return `<b>Nasc.:</b><span class="nota_botao">${_dataNascimento}</span> <b>CPF:</b><span class="nota_botao">${_cpf}</span> `
            },
            celulaLinha2(numeroSus){
                const _numeroSus = this.isEmpty(numeroSus) ? '' : numeroSus.replace(/(\d{4})(\d{4})(\d{4})(\d{3})/, '$1 $2 $3 $4') // eslint-disable-line 
                return `<b>Cartão SUS:</b><span class="nota_botao">${_numeroSus}</span>`
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
            async listaPesquisa(tipoPesquisa) {
                let _param = {}

                _param.tipo = tipoPesquisa
                _param.cidadeId = this.cidadeId
                if (this.infoPaciente.id == 0) {
                    _param.numeroSus = (this.infoPaciente.numeroSus == null) ? '' : this.infoPaciente.numeroSus
                    _param.cpf = (this.infoPaciente.cpf == null) ? '' : this.infoPaciente.cpf.replace(/\.|\-/g, '') // eslint-disable-line
                    _param.dataNascimento = (this.infoPaciente.dataNascimento == null) ? '' : this.infoPaciente.dataNascimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1') // eslint-disable-line
                    _param.celular = (this.infoPaciente.celular == null) ? '' : this.infoPaciente.celular
                } else {
                    _param.id = this.infoPaciente.id
                    _param.numeroSus = ''
                    _param.cpf = ''
                    _param.dataNascimento = ''
                    _param.celular = ''
                }

                this.isLoadingGrid = true
                this.mensagemBusca('Consultando dados do cidadão! Aguarde...')
                await mainService.listaPacientes(_param)
                    .then(resp => {
                        this.isLoadingGrid = false
                        console.log('listaPacientes-then', resp)
                        this.mensagemBusca('')
                        if (resp.status == 200) {
                            this.resultadoPesquisa = resp.data
                            this.pesquisaPronta = true
                            this.fechaPainel()
                        } else {
                            this.mensagemErro(resp.message)
                        }
                    })
                    .catch((resp) => {
                        this.isLoadingGrid = false
                        this.mensagemErro( mainService.catchPadrao(resp))
                    })
            },
            mensagemBusca (msg) {
                this.$emit('cbMensagemBusca', msg)
            },
            mensagemErro (msg) {
                this.$emit('cbMensagemErro', msg)
            }
        }
    }
</script>
