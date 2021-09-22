<template>
    <v-container class="pt-0 mt-0"> 
        <v-container fluid style="height: 100vmax;" class="pa-1">
            <BasicDialog :mostra="infoDialog.mensagem != ''" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem"/> 
            <!-- INICIO -->
            <v-flex v-if="emPesquisa==true">
                <v-card flat class="pa-0 mt-0">
                    <v-card-text class="ma-0 pa-0">
                        <v-expansion-panels class="mt-0" v-on:change="painelPorNome" v-model="painel[enumTipoPesquisa.porNome].aberto" >
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
                                <v-autocomplete
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
                                    <v-btn text color="secondary" @click="fechaPainel(enumTipoPesquisa.porNome)"> Fecha </v-btn>
                                    <v-btn text color="primary" @click="listaPesquisa(enumTipoPesquisa.porNome)"> Pesquisa </v-btn>
                                </v-card-actions>
                            </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                        <v-expansion-panels class="mt-2" v-on:change="painelPorLocalidade" v-model="painel[enumTipoPesquisa.porLocalidade].aberto">
                            <v-expansion-panel>
                            <v-expansion-panel-header>
                                <v-row no-gutters>
                                    <v-col cols="12">
                                    <b>Pesquisa por localidade</b>
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
                                <v-autocomplete @input="setaUnidadeSaude"
                                    dense
                                    clearable
                                    hide-no-data
                                    label="Unidade de Saúde"
                                    item-value="id"
                                    item-text="nome"
                                    :items="infoPesquisa.unidadesSaude"
                                ></v-autocomplete> 
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
                                <v-autocomplete @input="setaBairro"
                                    dense
                                    clearable
                                    hide-no-data
                                    label="Bairro"
                                    :items="infoPesquisa.bairros"
                                    item-value="id"
                                    item-text="nome"
                                ></v-autocomplete> 
                                <v-autocomplete @input="setaLogradouro"
                                    dense
                                    clearable
                                    hide-no-data
                                    label="Nome da rua"
                                    :disabled="infoPesquisa.bairroId === 0 || infoPesquisa.bairros.length === 0 "
                                    :items="infoPesquisa.logradouros"
                                    item-value="id"
                                    item-text="nome"
                                ></v-autocomplete>
                                <v-combobox
                                    v-model="model"
                                    :items="infoCidadao.todosSintomas"
                                    :search-input.sync="search2"
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
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn text color="secondary" @click="fechaPainel(enumTipoPesquisa.porLocalidade)"> Fecha </v-btn>
                                    <v-btn text color="primary" @click="listaPesquisa(enumTipoPesquisa.porLocalidade)"> Pesquisa </v-btn>
                                </v-card-actions>
                            </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-expansion-panels>
                    </v-card-text>
                </v-card>
                <v-card flat class="pt-0 mt-5" tile v-if="telaPronta" >
                    <v-list three-line>
                        <v-subheader class="justify-center px-0">
                            <v-col cols="11" class="px-0"><b>{{tituloLista}}</b></v-col>                    
                        </v-subheader>
                        <v-divider></v-divider>
                        <v-list-item-group v-model="pacienteIdSelecionado" color="primary" >
                            <v-flex v-for="(item) in listaReduzida" :key="item.id">
                            <v-list-item >
                                <v-list-item-content>
                                    <v-list-item-title v-html="item.nome"></v-list-item-title>
                                    <v-list-item-subtitle v-html="enderecoCidadaoConcatena(item.nomeLogradouro, item.numeroEndereco, item.complementoEndereco)"></v-list-item-subtitle>
                                    <v-list-item-subtitle  v-html="item.nomeMicroArea"></v-list-item-subtitle>
                                    <v-list-item-subtitle  v-html="item.nomeEstadoSaude"></v-list-item-subtitle>
                                </v-list-item-content>
                                <v-btn icon color="primary" @click="alteraSintoma(item.id)"><v-icon>mdi-dots-vertical</v-icon></v-btn>
                            </v-list-item>
                            <v-divider></v-divider>
                            </v-flex>
                        </v-list-item-group>
                    </v-list>
                </v-card>
            </v-flex>
            <v-flex v-else>         
                <v-layout justify-center class="pa-0 ma-0">
                    <v-subheader><b>Paciente em visitação</b></v-subheader>
                </v-layout>
                <v-divider></v-divider>
                <v-list-item >
                    <v-list-item-content>
                        <v-list-item-title class="text-wrap" v-html="infoCidadao.nome"></v-list-item-title>
                        <v-list-item-subtitle class="text-wrap" v-html="enderecoCidadaoConcatena(infoCidadao.nomeLogradouro, infoCidadao.numeroEndereco, infoCidadao.complementoEndereco)"></v-list-item-subtitle>
                        <v-list-item-subtitle  v-html="infoCidadao.nomeMicroArea"></v-list-item-subtitle>
                        <v-list-item-subtitle  v-html="infoCidadao.nomeEstadoSaude"></v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>
                <v-layout justify-center class="pa-0 ma-0">
                    <v-subheader><b>Marque os sintomas atuais do cidadão</b></v-subheader>
                </v-layout>
                <v-divider></v-divider>
                <v-flex class="pt-5">
                  <v-container class="pa-0 my-0" v-for="(item, index) in infoCidadao.sintomasTela" :key="item.id" >
                    <v-row class="pa-1"> 
                      <v-col cols="10" class="py-1"> 
                        <v-switch class="pa-0 mt-0"  v-model="infoCidadao.sintomasTela[index].selecionado" >
                            <template v-slot:label >
                              <span  v-bind:class="(item.id == -1)?'input__label':''">{{item.nome}}</span>
                            </template>
                          </v-switch>
                      </v-col>
                      <v-col cols="2" class="">
                        <v-text-field  class="pa-0"  @focus="$event.target.select()" 
                            type="number"
                            label="dias"
                            dense
                            v-model="infoCidadao.sintomasTela[index].dias"
                            v-show="infoCidadao.sintomasTela[index].selecionado == true"
                            :rules="[regras.Basicas.obrigatorio()]"
                          ></v-text-field> 
                      </v-col>
                    </v-row>
                  </v-container>
                  <br><br><br><br>
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
    import mainService from '../services/MainService'
    import BasicDialog from '../components/BasicDialog'
    import store from '../store'
    import rotinasProjeto from '../rotinasProjeto/rotinasProjeto'
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

            cidadeId: 0,
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
                lista: []
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
                sintomasTela:[]
            },
                entries: [],
                isLoading: false,
                model: [],
                search2: null,
          }
        },
        created() {
            this.cidadeId = store.getters.cidadeId
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
            listaReduzida () {
                return ((this.infoPesquisa.lista.length > 30) ? this.infoPesquisa.lista.slice(0, 30) : this.infoPesquisa.lista)
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
                        this.listaPacientes2(searchInput)
                    } else 
                        this.entries = []
                }
            },
            tituloLista: function() {
                let _numeroRegistros = this.infoPesquisa.lista.length
                let _retorno = (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : ` Lista de cidadãos (${_numeroRegistros}) `
                return _retorno
            },
        },       
        methods: {
            alteraSintoma: function (id) {
                this.pacienteIdSelecionado = id
                this.emPesquisa = !this.emPesquisa
                this.listaPaciente(this.pacienteIdSelecionado)
            },
            async buscaDadosIniciais() {
                console.log('buscaDadosIniciais.promise.inicio')
                this.mensagemBusca = 'Buscando sintomas! Aguarde...'
                await mainService.listaSintomas()
                .then (resp => {
                    if (resp.status == 200)  
                        this.infoCidadao.todosSintomas = resp.data
                })
                .catch (resp => {
                    this.mensagemErro =  mainService.catchPadrao(resp)
                    return
                });

                this.mensagemBusca = 'Buscando unidades de saude! Aguarde...'
                await mainService.listaUnidadesSaude(this.cidadeId, '')
                .then (resp => {
                    if (resp.status == 200)  
                        this.infoPesquisa.unidadesSaude = resp.data
                    console.log(resp.data)
                })
                .catch (resp => {
                    this.mensagemErro =  mainService.catchPadrao(resp)
                    return;
                });
                this.mensagemBusca = 'Buscando bairros! Aguarde...'
                await mainService.listaBairros(this.cidadeId)
                    .then (resp => {
                        if (resp.status == 200) 
                            this.infoPesquisa.bairros = resp.data
                    })
                    .catch (resp => {
                        this.mensagemErro =  mainService.catchPadrao(resp)
                        return;
                    });
                this.mensagemBusca = ''
                console.log('buscaDadosIniciais.promise.fim')
            },
            painelPorNome (val) {
                this.painel[this.enumTipoPesquisa.porLocalidade].aberto = (val !=  null) ? false : true
            },
            painelPorLocalidade (val) {
                this.painel[this.enumTipoPesquisa.porNome].aberto = (val !=  null) ? false : true
            },
            async listaPacientes2(searchInput) {
                const _param = {
                    'tipo': 3,
                    'cidadeId': this.cidadeId,
                    'nome': searchInput
                }
                this.isLoading = true
                const _resposta = await mainService.listaPacientes(_param)
                this.isLoading = false
                console.log('listaPacientes-then', _resposta)
                if (_resposta.status == 200) 
                    this.entries = _resposta.data
                else 
                    this.entries = []
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
            listaPesquisa(tipoPesquisa) {
                let _param = {}

                if (tipoPesquisa == this.enumTipoPesquisa.porNome) {
                    _param.tipo = 4
                    _param.cidadeId = this.cidadeId
                    _param.pacienteId= this.infoPesquisa.pacienteId
                } else {
                    _param.tipo = 2
                    _param.cidadeId = this.cidadeId
                    _param.unidadeSaudeId= this.infoPesquisa.unidadeSaudeId
                    _param.microAreaId= this.infoPesquisa.microAreaId
                    _param.bairroId= this.infoPesquisa.bairroId
                    _param.logradouroId= this.infoPesquisa.logradouroId
                }
                this.mensagemBusca = 'Consultando dados do cidadão! Aguarde...'
                mainService.listaPacientes(_param)
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
            },
            listaPaciente(pacienteId) {
                this.mensagemBusca = 'Buscando informações do cidadão..'
                Promise.all([
                    mainService.listaPaciente(pacienteId),
                    mainService.listaPacienteSintomas(pacienteId),
                ])
                .then(([_paciente, _pacienteSintomas]) => {
                    console.log('listaPaciente.then.inicio', Date.now())
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

                    if (_pacienteSintomas.status == 200) {
                        this.infoCidadao.sintomasTela = rotinasProjeto.ordenaSintomas(this.infoCidadao.todosSintomas, _pacienteSintomas.data)
                    } else {
                        this.mensagemErro=_paciente.message
                        return
                    }
                    console.log('listaPaciente.then.fim', Date.now())
                })
                .catch((response) => {
                    this.mensagemErro =  mainService.catchPadrao(response)
                })
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
                console.log('setaUnidadeSaude.inicio', id)
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
