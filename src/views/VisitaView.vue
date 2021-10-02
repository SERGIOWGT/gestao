<template>
    <v-container class="pt-0 mt-0"> 
        <v-container fluid style="height: 100vmax;" class="pa-1">
            <BasicDialog :mostra="infoDialog.mensagem != ''" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem"/> 
            <!-- INICIO -->
            <v-flex v-if="emPesquisa==true">
                <div style="text-align:center"><h4 class="teal--text ">CONSULTA PARA CADASTRO DE VISITA</h4></div>
                <v-card flat class="pa-0 mt-2">
                    <v-card-text class="ma-0 pa-0">
                        <v-expansion-panels class="mt-0" v-on:change="painelPorNome" v-model="painel[enumTipoPesquisa.porNome].aberto" >
                            <v-expansion-panel>
                            <v-expansion-panel-header class="blue-grey lighten-5 teal--text">
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
                                <v-autocomplete class="pb-0 pt-4"
                                    dense
                                    placeholder="Nome do Cidadão"
                                    clearable
                                    :items="entries"
                                    :search-input.sync="search"
                                    item-value="id"
                                    item-text="nome"
                                    hide-no-data
                                    :loading="isLoading"
                                    v-model="infoPesquisa.pacienteId"
                                ></v-autocomplete>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text small color="secondary" @click="fechaPainel(enumTipoPesquisa.porNome)"> Oculta </v-btn>
                                    <v-btn text small color="primary" :disabled="!pesquisaPorNomeLiberada || isLoadingGrid" @click="listaPesquisa(enumTipoPesquisa.porNome)"> Confirma </v-btn>
                                </v-card-actions>
                            </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <v-expansion-panels class="mt-2" v-on:change="painelPorLocalidade" v-model="painel[enumTipoPesquisa.porLocalidade].aberto">
                            <v-expansion-panel>
                            <v-expansion-panel-header  class="blue-grey lighten-5 teal--text">
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
                                    :items="infoCidadao.todosSintomas"
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
                                    :items="infoCidadao.todasComorbidades"
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
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="secondary" @click="fechaPainel(enumTipoPesquisa.porLocalidade)"> Oculta </v-btn>
                                    <v-btn text color="primary" :disabled="isLoadingGrid" @click="listaPesquisa(enumTipoPesquisa.porLocalidade)"> Confirma </v-btn>
                                </v-card-actions>
                            </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>
                <v-card flat class="pt-0 mt-5" tile v-if="telaPronta" >
                    <v-list three-line>
                        <v-subheader class="justify-center px-1">
                            <v-col class="px-0"><b>{{tituloLista}}</b></v-col>                    
                        </v-subheader>
                        <v-divider></v-divider>
                        <v-list-item-group v-model="pacienteIdSelecionado" color="primary" >
                            <v-flex v-for="(item) in infoPesquisa.lista" :key="item.id">
                                <v-list-item >
                                    <v-list-item-content>
                                        <v-list-item-title v-html="item.nome"></v-list-item-title>
                                        <v-list-item-subtitle v-html="enderecoCidadaoConcatena(item.nomeLogradouro, item.numeroEndereco, item.complementoEndereco)"></v-list-item-subtitle>
                                        <v-list-item-subtitle  v-html="item.nomeMicroArea"></v-list-item-subtitle>
                                        <v-list-item-subtitle  v-html="item.nomeEstadoSaude"></v-list-item-subtitle>
                                    </v-list-item-content>
                                    <v-btn icon color="primary" @click="alteraSintoma(item.id)"><v-icon>mdi-thermometer-plus</v-icon></v-btn>
                                </v-list-item>
                                <v-divider></v-divider>
                            </v-flex>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex v-else>         
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

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn small text color="secondary" > Oculta </v-btn>
                            </v-card-actions>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <br>
                    <v-divider></v-divider>
                    <v-expansion-panel class="mt-2">
                        <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Consulte aqui as Comorbidades</v-expansion-panel-header >
                        <v-expansion-panel-content >
                            <v-flex class="px-0 pt-2" v-for="(item) in infoCidadao.comorbidades" :key="item.id" >
                                <v-chip> {{item.nome}} </v-chip>
                            </v-flex>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel class="mt-2">
                        <v-expansion-panel-header class="blue-grey lighten-5 teal--text text--lighten-2">Informe aqui os Sintomas</v-expansion-panel-header>
                        <v-expansion-panel-content class="pt-2">
                            <v-flex class="px-0 pt-0 pb-5" v-for="(item, index) in infoPesquisa.sintomasTela" :key="item.id" >
                            <v-row class="pa-1"> 
                                <v-col cols="9" class="pa-0"> 
                                    <v-checkbox  class="py-0" v-model="infoPesquisa.sintomasTela[index].selecionado" :label="item.nome"></v-checkbox>
                                </v-col>
                                <v-col cols="3">
                                    <v-text-field  class="py-0"  @focus="$event.target.select()" 
                                        dense hide-details
                                        type="number"
                                        label="dias"
                                        v-model="infoPesquisa.sintomasTela[index].dias"
                                        v-show="infoPesquisa.sintomasTela[index].selecionado == true"
                                        min=0
                                    ></v-text-field> 
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            </v-flex>
                            <p>.</p>
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
                        @funcaoRetorno= 'cmdBotao'
                 />
                </v-flex>
            </v-flex>
        </v-container>
    </v-container>
</template>
<script>
    import mainService from '../services/mainService'
    import BasicDialog from '../components/BasicDialog'
    import store from '../store'
    import regrasCampos from '../bibliotecas/regrasCampos'
    import BottomBar from '../components/StepBottomBar'
    import Pacientes from '../rotinasProjeto/salvaPacienteSintomas'

    export default {
        components: {
            BasicDialog, BottomBar
        },
        data() {
          return {
            regras: regrasCampos,

            enumTipoPesquisa: {
              porNome: 0,
              porLocalidade: 1,
            },
            painel: [{aberto: false, desabilitado: false}, {aberto: false, desabilitado: false}],

            cidadePadrao: null,
            unidadeSaudePadrao: null,
            mnicroAreaPadrao: null,
            bairroPadrao: null,
            logradouroPadrao: null,

            emPesquisa: true,
            telaPronta: false,
            pacienteIdSelecionado: 0,
            
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
            infoDialog: {
                tipo: 0,
                mensagem: ''
            },
            infoCidadao: {
                id: 0,
                nome: '',
                nomeLogradouro: '',
                numeroEndereco: '',
                complementoEndereco: '',
                nomeMicroArea: '',
                nomeEstadoSaude: '',
                sintomasAtuais: [],
                todosSintomas: [],
                todasComorbidades: [],
                sintomasTela:[],
                comorbidades:[]
            },
            entries: [],
            isLoading: false,
            isLoadingGrid: false,
            model: [],
            syncSintoma: null,
            syncComorbidade: null,
          }
        },
        created() {
            this.cidadePadrao = store.getters.cidadePadrao
            this.unidadeSaudePadrao = store.getters.unidadeSaudePadrao
            this.microAreaPadrao = store.getters.microAreaPadrao
            this.bairroPadrao = store.getters.bairroPadrao
            this.logradouroPadrao = store.getters.logradouroPadrao

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
            mensagemBusca: {
                get: function() { return this.infoDialog.mensagem},
                set: function(mensagem) {
                    this.infoDialog.tipo = 0
                    this.infoDialog.mensagem = mensagem
                }
            },
            mensagemErro: {
                get: function() { return this.infoDialog.mensagem},
                set: function(mensagem) {
                    this.infoDialog.tipo = 1
                    this.infoDialog.mensagem = mensagem
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
                        this.entries = []
                }
            },
            tituloLista: function() {
                const _numeroRegistros = this.infoPesquisa.lista.length
                return (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : (_numeroRegistros == 1) ? ` Um cidadão retornado na pesquisa  ` : ` ${_numeroRegistros} cidadãos retornados`
            },
        },       
        methods: {
            async alteraSintoma(id) {
                this.pacienteIdSelecionado = id
                await this.listaPaciente(this.pacienteIdSelecionado)
                this.emPesquisa = !this.emPesquisa
            },
            async buscaDadosIniciais() {
                this.mensagemBusca = 'Buscando sintomas! Aguarde...'
                await mainService.listaSintomas()
                .then (resp => {this.infoCidadao.todosSintomas = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                this.mensagemBusca = 'Buscando Comorbidades! Aguarde...'
                await mainService.listaComorbidades()
                .then (resp => {this.infoCidadao.todasComorbidades = (resp.status == 200) ? resp.data : []})
                .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});

                if (this.unidadeSaudePadrao.id == 0) {
                    this.mensagemBusca = 'Buscando unidades de saude! Aguarde...'
                    await mainService.listaUnidadesSaude(this.cidadePadrao.id, '')
                    .then (resp => {this.infoPesquisa.unidadesSaude = (resp.status == 200) ? resp.data : []})
                    .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});                
                } else {
                    if (this.microAreaPadrao.id == 0) {
                        this.mensagemBusca = 'Buscando Micro Áreas... Aguarde'
                        await mainService.listaMicroAreas(this.unidadeSaudePadrao.id)
                        .then(resp => {this.infoPesquisa.microAreas = (resp.status == 200) ? resp.data : []})
                        .catch((err) => {this.mensagemErro =  mainService.catchPadrao(err)})
                    }
                }
                if (this.bairroPadrao.id == 0) {
                    this.mensagemBusca = 'Buscando bairros! Aguarde...'
                    await mainService.listaBairros(this.cidadePadrao.id)
                    .then (resp => {
                        this.infoPesquisa.bairros = (resp.status == 200) ? resp.data : []
                    })
                    .catch (resp => {this.mensagemErro =  mainService.catchPadrao(resp)});
                } else {
                    if (this.logradouroPadrao.id == 0) {
                        this.mensagemBusca = 'Buscando Logradouros... Aguarde'
                        await mainService.listaLogradouros(this.bairroPadrao.id)
                        .then(resp => {
                            this.infoPesquisa.logradouros = (resp.status == 200) ? resp.data : []
                        })
                        .catch((err) => {this.mensagemErro =  mainService.catchPadrao(err)})
                    }
                }
                if (this.mensagemBusca != '')
                    this.mensagemBusca = ''


            },
            painelPorNome (val) {
                this.painel[this.enumTipoPesquisa.porLocalidade].aberto = (val !=  null) ? false : true
            },
            painelPorLocalidade (val) {
                this.painel[this.enumTipoPesquisa.porNome].aberto = (val !=  null) ? false : true
            },
            async listaPacientePorNome(cidadeId, parteNome) {
                const param = {cidadeId: cidadeId, nome: parteNome}
                const resp = await mainService.listaPacientes(param)
                this.isLoading = true
                if (resp.status == 200) 
                    this.entries = resp.data
                else 
                    this.entries = []
                this.isLoading = false
                
            },
            cmdBotao: function (value) {
                console.log('cmdBotao-inicio', value)
                if (value == 'VO') {
                    this.emPesquisa = true
                } else 
                    this.salvaCidadaoSintomas()
            },
            enderecoCidadaoConcatena: function(nomeLogradouro, numeroEndereco, complementoEndereco) {
                let _retorno = nomeLogradouro + (numeroEndereco ? ', ' + numeroEndereco : '')
                _retorno += (complementoEndereco ? ' - ' + complementoEndereco : '')
                return _retorno
            },
            fechaPainel (tipoPesquisa) {
                console.log('fechaPainel (tipoPesquisa)', tipoPesquisa)
                this.painel[tipoPesquisa].aberto = false
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

                    console.log(_param)
                }
                this.isLoadingGrid = true
                this.mensagemBusca = 'Consultando dados do cidadão! Aguarde...'
                await mainService.listaPacientesCompleta(_param)
                .then(_resposta => {
                    console.log('listaPacientes-then', _resposta)
                    this.mensagemBusca = ''
                    if (_resposta.status == 200) {
                        this.infoPesquisa.lista = _resposta.data
                        this.telaPronta = true
                        this.fechaPainel(tipoPesquisa)
                    } else {
                        this.mensagemErro = _resposta.message
                    }
                })
                .catch((response) => {
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
                this.isLoadingGrid = false
            },
            async listaPaciente(pacienteId) {
                this.mensagemBusca = 'Buscando informações do cidadão. Aguarde...'
                await mainService.listaPaciente(pacienteId)
                .then((_paciente) => {
                    this.mensagemBusca = ''
                    if (_paciente.status == 200) {
                        this.infoCidadao.nome = _paciente.data[0].nome
                        this.infoCidadao.nomeLogradouro = _paciente.data[0].nomeLogradouro
                        this.infoCidadao.numeroEndereco = _paciente.data[0].nomeEndereco
                        this.infoCidadao.complementoEndereco = _paciente.data[0].complementoEndereco
                        this.infoCidadao.nomeMicroArea = _paciente.data[0].nomeMicroArea
                        this.infoCidadao.nomeEstadoSaude = _paciente.data[0].nomeEstadoSaude
                    }
                    else {
                        this.mensagemErro=_paciente.message  
                    }
                })
                .catch((response) => {this.mensagemErro =  mainService.catchPadrao(response)})

                this.mensagemBusca = 'Buscando comorbidades do cidadão. Aguarde...'
                await mainService.listaPacienteComorbidades(pacienteId)
                .then((resp) => {
                    this.mensagemBusca = ''
                    this.infoCidadao.comorbidades = resp.status == 200 ? resp.data : []

                    this.infoCidadao.comorbidades.forEach(linha => {
                        const index = this.infoCidadao.todasComorbidades.findIndex( el => el.id === linha.id );
                        if (index != -1) {
                            linha.nome = this.infoCidadao.todasComorbidades[index].nome
                        }
                    });
                })
                .catch((response) => {this.mensagemErro =  mainService.catchPadrao(response)})

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
                    this.mensagemBusca = 'Buscando Logradouros ... Aguarde'
                    this.infoPesquisa.bairroId = id;
                    mainService.listaLogradouros(this.infoPesquisa.bairroId)
                    .then(resposta => {
                        this.mensagemBusca = ''
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
                    this.mensagemBusca = 'Buscando Micro Áreas... Aguarde'
                    mainService.listaMicroAreas(this.infoPesquisa.unidadeSaudeId)
                    .then(resposta => {
                        console.log('setaUnidadeSaude.then')
                        this.mensagemBusca=''
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
            salvaCidadaoSintomas() {
                Pacientes.salvaSintomas(
                    this.pacienteIdSelecionado, 
                    this.infoCidadao.sintomasTela, 
                    (msg) => {
                        this.mensagemBusca = msg
                    },
                    this.mensagemErro,
                    () => {
                        this.emPesquisa = true
                    }
                )
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
</style>
