<template>
    <v-container fluid style="height: 100vmax;" class="pa-1">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <v-flex  v-show="buscandoDados==false">
            <!-- INICIO -->
            <v-flex v-if="operacaoAtual==enumOperacao.pesquisa">
                <v-subheader class="justify-center px-0 py-0 teal--text"><b>CONSULTA PARA CADASTRO DE VISITA</b></v-subheader>
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
                                placeholder="Nome do Cidadão"
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
                                <v-btn text small color="secondary"> Limpar </v-btn>
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
                            <v-btn text small color="secondary"> Limpar </v-btn>
                            <v-btn text small color="teal lighten-2" :disabled="!pesquisaOutrosLiberada || isLoading || isLoadingGrid" @click="listaPesquisa(enumTipoPesquisa.porLocalidade)"> Buscar </v-btn>
                        </v-card-actions>
                    </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-card flat class="pt-0 mt-5" tile v-if="telaPronta" >
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
            <v-flex v-if="operacaoAtual==enumOperacao.cadastroVisita">
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
                            >{{enderecoCidadaoConcatena(infoCidadao.nomeLogradouro, infoCidadao.numeroEndereco, infoCidadao.complementoEndereco)}}</v-text-field >
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
            <v-flex v-else>         
                <CadastraCidadao 
                    v-if="operacaoAtual == enumOperacao.cadastroCidadao"
                    :pacienteId='infoVisita.pacienteId'
                    @cbFimCadastro='fimCadastro'
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
    import CadastraCidadao from '../components/CidadaoCadastra';

    export default {
        components: {
            ProgressBar, MessageBox, BottomBar, CadastraCidadao
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

            enumOperacao: {
                pesquisa: 0,
                cadastroVisita: 1,
                cadastroCidadao: 2
            },
            operacaoAtual: 0,
            
            telaPronta: false,
            podeSalvar: false,
            
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
            todosSintomas: [],
            todasComorbidades: [],
            
            nomesCidadaos: [],

            infoVisita:  {
                id: 0,
                pacienteId: 0,
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
            isLoading: false,
            isLoadingGrid: false,
            model: [],
            syncSintoma: null,
            syncComorbidade: null,
            buscandoDados: true,
            
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
            enderecoAtual:  {
                get: function() { 
                    let _retorno = this.infoCidadao.nomeLogradouro + (this.infoCidadao.numeroEndereco ? ', ' + this.infoCidadao.numeroEndereco : '')
                    _retorno += (this.infoCidadao.complementoEndereco ? ' - ' + this.infoCidadao.complementoEndereco : '')
                    return _retorno
                },
                set: function() {
                }
            },
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
            tipoDataVisita() {
                const str = formata.data(this.infoUltimaVisita.data.substring(0, 10))
                return `${this.infoUltimaVisita.nomeTipoRelatorio} em ${str}`
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

                this.mensagemAguarde = 'Buscando sintomas! Aguarde...'
                await mainService.listaSintomas()
                .then (resp => {this.todosSintomas = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                this.mensagemAguarde = 'Buscando Comorbidades! Aguarde...'
                await mainService.listaComorbidades()
                .then (resp => {this.todasComorbidades = (resp.status == 200) ? resp.data : []})
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

                this.mensagemAguarde = ''
                this.buscandoDados = false
            },
            cmdBotao: function (value) {
                if (value == 'VO') {
                    this.fimCadastro()
                } else 
                    this.salvaVisita()
            },
            editaCidadao(pacienteId) {
                this.infoVisita.pacienteId = pacienteId
                this.operacaoAtual = this.enumOperacao.cadastroCidadao
            },
            enderecoCidadaoConcatena (nomeLogradouro, numeroEndereco, complementoEndereco) {
                let _retorno = nomeLogradouro + (numeroEndereco ? ', ' + numeroEndereco : '')
                _retorno += (complementoEndereco ? ' - ' + complementoEndereco : '')
                return _retorno
            },
            fechaPainel () {
                this.areaPesquisaAberta = null
            },
            fimCadastro(volta) {
                if (volta == false) {
                    this.mensagemSucesso = 'Cidadão ' + (this.pacienteId == 0? 'cadastrado' : 'alterado') + ' com sucesso!' 
                } 

                this.operacaoAtual = this.enumOperacao.pesquisa
            },
            async incluiVisita(pacienteId) {
                this.infoVisita.pacienteId = pacienteId
                this.infoVisita.data = formata.dataDDMMYYYY(new Date())
                this.operacaoAtual = this.enumOperacao.cadastroVisita
                await this.listaPaciente(pacienteId)
            },
            isEmpty(value) {
                return (value == null || value === '');
            },
            async listaPaciente(pacienteId) {
                let erroBusca = false

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
                    this.infoVisita.sintomas = rotinasCadastraPaciente.ordenaSintomas(this.todosSintomas, this.infoCidadao.sintomas)
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
                    if (resp.status == 200)  {
                        const data = resp.data
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
                        this.telaPronta = true
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
            async salvaVisita() {
                this.mensagemAguarde = 'Salvando a visita. Aguarde...'

                const data = this.infoVisita.data.replace(/(\d{2})\/(\d{2})\/(\d{4})/,'$3-$2-$1')  // eslint-disable-line
                const sintomas = this.infoVisita.sintomas.filter(e => e.selecionado === true);
                const params = {
                    pacienteId: this.infoVisita.pacienteId,
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
                        this.mensagemSucesso = 'Visita cadastrada com sucesso!'
                        this.operacaoAtual = this.enumOperacao.pesquisa
                    }
                })
                .catch(err => {this.mensagemErro = mainService.catchPadrao(err); return;});
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
