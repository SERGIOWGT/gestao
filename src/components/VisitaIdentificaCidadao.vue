<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <v-subheader class="justify-center px-0 py-0 teal--text"><b>CONSULTA PARA CADASTRO DE VISITA</b></v-subheader>
        <v-flex v-show="buscandoDados==false">
            <v-expansion-panels focusable class="pt-0 mt-0" v-model="areaPesquisaAberta">
                <v-expansion-panel default>
                    <v-expansion-panel-header class="blue-grey lighten-5 teal--text  px-3">
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
                            placeholder="Digite aqui o nome do Cidadão"
                            clearable
                            :items="nomesCidadaos"
                            :search-input.sync="search"
                            item-value="id"
                            item-text="nome"
                            hide-no-data
                            :loading="isLoading"
                            v-model="infoPesquisa.pacienteId"
                        ></v-autocomplete>
                        <v-card-actions class="pt-2 pb-0">
                            <v-spacer></v-spacer>
                            <v-btn text small color="teal lighten-2" :disabled="!pesquisaPorNomeLiberada || isLoading || isLoadingGrid" @click="listaPesquisa(enumTipoPesquisa.porNome)"> Buscar </v-btn>
                        </v-card-actions>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="mt-2"> 
                <v-expansion-panel-header  class="blue-grey lighten-5 teal--text  px-3">
                    <v-row no-gutters>
                        <v-col cols="12">
                        PESQUISA POR LOCALIDADE E SINTOMAS
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
                    <v-form ref="form" class="mx-0" v-model="formularioValido">
                        <v-flex v-if="this.unidadeSaudePadrao.id == 0" >
                            <v-autocomplete @input="setaUnidadeSaude" class="pb-0 pt-4"
                                dense
                                clearable
                                hide-no-data
                                label="Unidade de Saúde"
                                item-value="id"
                                item-text="nome"
                                :items="infoPesquisa.unidadesSaude"
                            ></v-autocomplete> 
                        </v-flex>
                        <v-flex v-else>
                            <v-text-field class="pb-0 pt-4"
                                dense disabled
                                label="Unidade de saúde"
                                v-model="unidadeSaudePadrao.nome"
                            ></v-text-field>
                        </v-flex>
                        
                        <v-flex v-if="this.microAreaPadrao.id == 0" >
                            <v-autocomplete @input="setaMicroArea"
                                dense
                                clearable
                                hide-no-data
                                label="Micro Área"
                                :disabled="infoPesquisa.unidadeSaudeId === 0 || infoPesquisa.microAreas.length === 0 "
                                :items="infoPesquisa.microAreas"
                                item-value="id"
                                item-text="nome"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex v-else>
                            <v-text-field class="pb-0 pt-2"
                                dense disabled
                                label="Micro Àrea"
                                v-model="microAreaPadrao.nome"
                            ></v-text-field>
                        </v-flex>

                        <v-flex v-if="this.bairroPadrao.id == 0" >
                            <v-autocomplete @input="setaBairro"
                                dense
                                clearable
                                hide-no-data
                                label="Bairro"
                                :items="infoPesquisa.bairros"
                                item-value="id"
                                item-text="nome"
                            ></v-autocomplete> 
                        </v-flex>
                        <v-flex v-else>
                            <v-text-field class="pb-0 pt-2"
                                dense disabled
                                label="Bairro"
                                v-model="bairroPadrao.nome"
                            ></v-text-field>
                        </v-flex>
                        
                        <v-flex v-if="this.logradouroPadrao.id == 0" >
                            <!-- :disabled="infoPesquisa.bairroId === 0 || infoPesquisa.bairros.length === 0 " -->
                            <v-autocomplete @input="setaLogradouro"
                                dense
                                clearable
                                hide-no-data
                                label="Nome da rua"
                                :disabled="infoPesquisa.bairroId === 0  "
                                :items="infoPesquisa.logradouros"
                                item-value="id"
                                item-text="nome"
                            ></v-autocomplete>
                        </v-flex>
                        <v-flex v-else>
                            <v-text-field class="pb-0 pt-2"
                                dense disabled
                                label="Logradouro"
                                v-model="logradouroPadrao.nome"
                            ></v-text-field>
                        </v-flex>

                        <v-combobox
                            v-model="infoPesquisa.sintomas"
                            :items="todosSintomas"
                            :search-input.sync="syncSintoma"
                            hide-selected
                            label="Escolha até 5 sintomas"
                            item-value="id"
                            item-text="nome"
                            multiple
                            persistent-hint
                            small-chips
                            clearable
                        >
                            <template v-slot:no-data>
                                <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                    Não há resultados para "<strong>{{ search }}</strong>". 
                                    </v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>
                        <v-combobox
                            v-model="infoPesquisa.comorbidades"
                            :items="todasComorbidades"
                            :search-input.sync="syncComorbidade"
                            hide-selected
                            label="Escolha até 5 Comorbidades"
                            item-value="id"
                            item-text="nome"
                            multiple
                            persistent-hint
                            small-chips
                            clearable
                        >
                            <template v-slot:no-data>
                                <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>
                                    Não há resultados para "<strong>{{ search }}</strong>". 
                                    </v-list-item-title>
                                </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-combobox>
                    </v-form>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text small color="secondary" @click="limpaPesquisa()"> Limpar </v-btn>
                        <v-btn text small color="teal lighten-2" :disabled="!pesquisaOutrosLiberada || isLoading || isLoadingGrid" @click="listaPesquisa(enumTipoPesquisa.porLocalidade)"> Buscar </v-btn>
                    </v-card-actions>
                </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <v-card flat class="pt-0 mt-5" tile v-if="gridPronto" >
                <v-list three-line>
                    <v-subheader class="justify-center px-1">
                        <v-col class="px-0"><b>{{tituloLista}}</b></v-col>                    
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group color="primary" >
                        <v-flex v-for="(item) in infoPesquisa.lista" :key="item.id">
                            <v-list-item >
                                <v-row>
                                    <v-col cols="10">
                                        <v-list-item-content>
                                            <v-list-item-title v-html="item.nome"></v-list-item-title>
                                            <v-list-item-subtitle v-html="enderecoCidadaoConcatena(item.nomeLogradouro, item.numeroEndereco, item.complementoEndereco)"></v-list-item-subtitle>
                                            <v-list-item-subtitle  v-html="item.nomeMicroArea"></v-list-item-subtitle>
                                            <v-list-item-subtitle  v-html="item.nomeEstadoSaude"></v-list-item-subtitle>
                                        </v-list-item-content>
                                    </v-col>
                                    <v-col cols="2" class="justify-center pt-6">
                                        <v-btn icon color="teal lighten-2" @click="incluiVisita(item.id)"><v-icon>mdi-thermometer-plus</v-icon></v-btn>
                                        <v-btn icon color="teal lighten-2" @click="editaCidadao(item.id)"><v-icon>mdi-account-cog-outline</v-icon></v-btn>
                                    </v-col>
                                </v-row>
                            </v-list-item>
                            <v-divider></v-divider>
                        </v-flex>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-flex>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import MessageBox from '../lastec.components/lastec-messagebox'
    import ProgressBar from '../lastec.components/lastec-progressbar'

    export default {
        components: {
            ProgressBar, MessageBox
        },
        data() {
          return {
            regras: regrasCampos,

            enumTipoPesquisa: {
              porNome: 0,
              porLocalidade: 1,
            },

            buscandoDados: true,
            gridPronto: false,
            isLoading: false,
            isLoadingGrid: false,

            areaPesquisaAberta: 0,
            formularioValido: false,

            cidadePadrao: null,
            unidadeSaudePadrao: null,
            mnicroAreaPadrao: null,
            bairroPadrao: null,
            logradouroPadrao: null,
            
            infoPesquisa: {
                tipo: -1,
                pacienteId: 0,
                bairroId: 0,
                logradouroId: 0,
                unidadeSaudeId: 0,
                microAreaId: 0,
                bairros: [],
                logradouros: [],
                unidadesSaude: [],
                microAreas: [],
                lista: [],
                sintomas: [],
                comorbidades: []
            },
            tiposRelatoriosVisitas: [],
            todosSintomas: [],
            todasComorbidades: [],
            
            nomesCidadaos: [],

            model: [],
            syncSintoma: null,
            syncComorbidade: null,
            
            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: ''
          }
        },
        created() {
            this.cidadePadrao = this.$store.getters.cidadePadrao
            this.unidadeSaudePadrao = this.$store.getters.unidadeSaudePadrao
            this.microAreaPadrao = this.$store.getters.microAreaPadrao
            this.bairroPadrao = this.$store.getters.bairroPadrao
            this.logradouroPadrao = this.$store.getters.logradouroPadrao

            this.infoPesquisa.unidadeSaudeId = this.unidadeSaudePadrao.id
            this.infoPesquisa.microAreaId = this.microAreaPadrao.id
            this.infoPesquisa.bairroId = this.bairroPadrao.id
            this.infoPesquisa.logradouroId = this.logradouroPadrao.id
        },
        mounted() {
            this.buscaDadosIniciais()
        },
        watch: {
            model (val) {
                if (val.length > 5) {
                    this.$nextTick(() => this.model.pop())
                }
            },
            mensagemAguarde (val) {
                this.isLoading = (val == '') ? false : true
            }
        },
        computed: {
            pesquisaPorNomeLiberada () {
                return (this.infoPesquisa.pacienteId != 0) 
            },
            pesquisaOutrosLiberada () {
                return this.formularioValido && (!this.isEmpty(this.infoPesquisa.unidadeSaudeId) || !this.isEmpty(this.infoPesquisa.microAreaId) || !this.isEmpty(this.infoPesquisa.bairroId) || !this.isEmpty(this.infoPesquisa.logradouroId))
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
            search: {
                get () {
                    return this.queryTerm
                },
                set (searchInput) {
                    if ((searchInput) && (searchInput.length >= 3)) {
                        this.listaPacientePorNome(this.cidadePadrao.id, searchInput)
                    } else 
                        this.nomesCidadaos = []
                }
            },
            tituloLista: function() {
                const _numeroRegistros = this.infoPesquisa.lista.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um cidadão retornado na pesquisa  ` : ` ${_numeroRegistros} cidadãos retornados`
            },
        },       
        methods: {
            async buscaDadosIniciais() {
                this.buscandoDados = true
                                
                this.mensagemAguarde = 'Buscando Tipo Relatório Visita! Aguarde...'
                await mainService.listaTipoRelatorioVisita()
                .then (resp => {this.tiposRelatoriosVisitas = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                if (this.unidadeSaudePadrao.id == 0) {
                    this.mensagemAguarde = 'Buscando unidades de saude! Aguarde...'
                    await mainService.listaUnidadesSaude(this.cidadePadrao.id, '')
                    .then (resp => {this.infoPesquisa.unidadesSaude = (resp.status == 200) ? resp.data : []})
                    .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});                
                } else {
                    if (this.microAreaPadrao.id == 0) {
                        this.mensagemAguarde = 'Buscando Micro Áreas... Aguarde'
                        await mainService.listaMicroAreas(this.unidadeSaudePadrao.id)
                        .then(resp => {this.infoPesquisa.microAreas = (resp.status == 200) ? resp.data : []})
                        .catch((err) => {this.mensagemErro =  mainService.catchPadrao(err)})
                    }
                }
                if (this.bairroPadrao.id == 0) {
                    this.mensagemAguarde = 'Buscando bairros! Aguarde...'
                    await mainService.listaBairros(this.cidadePadrao.id)
                    .then (resp => {
                        this.infoPesquisa.bairros = (resp.status == 200) ? resp.data : []
                    })
                    .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});
                } else {
                    if (this.logradouroPadrao.id == 0) {
                        this.mensagemAguarde = 'Buscando Logradouros... Aguarde'
                        await mainService.listaLogradouros(this.bairroPadrao.id)
                        .then(resp => {
                            this.infoPesquisa.logradouros = (resp.status == 200) ? resp.data : []
                        })
                        .catch((err) => {this.mensagemErro =  mainService.catchPadrao(err)})
                    }
                }

                this.todosSintomas = this.$store.getters.todosSintomas
                this.todasComorbidades = this.$store.getters.todasComorbidades

                this.mensagemAguarde = ''
                this.buscandoDados = false
            },
            limpaPesquisa() {
            },
            editaCidadao(pacienteId) {
                this.$emit('cbEditaCidadao', pacienteId)
            },
            enderecoCidadaoConcatena (nomeLogradouro, numeroEndereco, complementoEndereco) {
                let _retorno = nomeLogradouro + (numeroEndereco ? ', ' + numeroEndereco : '')
                _retorno += (complementoEndereco ? ' - ' + complementoEndereco : '')
                return _retorno
            },
            fechaPainel () {
                this.areaPesquisaAberta = null
            },
            async incluiVisita(pacienteId) {
                this.$emit('cbNovaVisita', pacienteId)
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            async listaPacientePorNome(cidadeId, parteNome) {
                const param = {cidadeId: cidadeId, nome: parteNome}
                const resp = await mainService.listaPacientes(param)
                this.isLoading = true
                if (resp.status == 200) 
                    this.nomesCidadaos = resp.data
                else 
                    this.nomesCidadaos = []
                this.isLoading = false
                
            },
            async listaPesquisa(tipoPesquisa) {
                let _param = {cidadeId: this.cidadePadrao.id}

                if (tipoPesquisa == this.enumTipoPesquisa.porNome) {
                    _param.id= this.infoPesquisa.pacienteId
                } else {
                    _param.unidadeSaudeId= this.infoPesquisa.unidadeSaudeId
                    _param.microAreaId= this.infoPesquisa.microAreaId
                    _param.bairroId= this.infoPesquisa.bairroId
                    _param.logradouroId= this.infoPesquisa.logradouroId
                    _param.sintomas = []
                    _param.comorbidades = []
                    _param.doencas = []

                    this.infoPesquisa.sintomas.forEach((linha) => {
                        _param.sintomas.push(linha.id)
                    })

                    this.infoPesquisa.comorbidades.forEach((linha) => {
                        _param.comorbidades.push(linha.id)
                    })
                }
                this.isLoadingGrid = true
                this.mensagemAguarde = 'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPacientesCompleta(_param)
                .then(_resposta => {
                    this.mensagemAguarde = ''
                    if (_resposta.status == 200) {
                        this.infoPesquisa.lista = _resposta.data
                        this.gridPronto = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro = _resposta.message
                    }
                })
                .catch((response) => {
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                this.isLoadingGrid = false
            },
            setaLogradouro(id) {
                this.infoPesquisa.logradouroId = id;
            },
            setaMicroArea(id) {
                this.infoPesquisa.microAreaId = id;
            },
            setaBairro(id) {
                if (id == null) {
                    this.infoPesquisa.bairroId = 0
                    this.infoPesquisa.logradouros = []
                } else {
                    this.mensagemAguarde = 'Buscando Logradouros ... Aguarde'
                    this.infoPesquisa.bairroId = id;
                    mainService.listaLogradouros(this.infoPesquisa.bairroId)
                    .then(resposta => {
                        this.mensagemAguarde = ''
                        if (resposta.status == 200) {
                            this.infoPesquisa.logradouros = resposta.data;
                        } else {
                            this.mensagemErro = resposta.message
                        }
                    })
                    .catch((response) => {
                        this.mensagemErro =  mainService.catchPadrao(response)
                    })
                }
            },
            setaUnidadeSaude(id) {
                if (id == null) {
                    this.infoPesquisa.unidadeSaudeId = 0
                    this.infoPesquisa.microAreas = []
                } else {
                    this.infoPesquisa.unidadeSaudeId = id;
                    this.mensagemAguarde = 'Buscando Micro Áreas... Aguarde'
                    mainService.listaMicroAreas(this.infoPesquisa.unidadeSaudeId)
                    .then(resposta => {
                        this.mensagemAguarde=''
                        if (resposta.status == 200) {
                            this.infoPesquisa.microAreas = resposta.data;
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch((response) => {
                        this.mensagemErro =  mainService.catchPadrao(response)
                    })
                }
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