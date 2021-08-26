<template>
    <v-container class="pt-0 mt-0"> 
        <v-container fluid style="height: 100vmax;" class="pa-1 grey lighten-5">
            <DialogProgressBar :mostra="infoDialog.mostra" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem" @funcaoRetorno= 'fechaDialog'/>

            <!-- INICIO -->
            <v-card flat class="pa-0 mt-0">
                <v-card-text class="ma-0 pa-0">
                    <v-expansion-panels class="mt-0" v-model="painelAberto">
                        <v-expansion-panel>
                        <v-expansion-panel-header>
                            <v-row no-gutters>
                                <v-col cols="12">
                                <b>Informe dados cadastrais para pesquisa</b>
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
                                v-model="infoPesquisa.nomePaciente"
                                placeholder="Nome do Cidadão"
                                clearable
                            ></v-text-field>
                            <v-select @input="setaUnidadeSaude"
                                required
                                dense
                                label="Unidade de Saúde"
                                :items="infoPesquisa.unidadesSaude"
                                v-model="infoPesquisa.unidadeSaudeId"
                                item-value="id"
                                item-text="nome"
                                clearable
                            ></v-select> 
                            <v-select @input="setaMicroArea"
                                dense
                                label="Micro Área"
                                :disabled="infoPesquisa.unidadeSaudeId === 0 || infoPesquisa.microAreas.length === 0 "
                                v-model="infoPesquisa.microAreaId"
                                :items="infoPesquisa.microAreas"
                                item-value="id"
                                item-text="nome"
                                clearable
                            ></v-select>
                            <v-select @input="setaBairro"
                                required
                                dense
                                v-model="infoPesquisa.bairroId"
                                label="Bairro"
                                :items="infoPesquisa.bairros"
                                item-value="id"
                                item-text="nome"
                                clearable
                            ></v-select> 
                            <v-select @input="setaLogradouro"
                                dense
                                label="Nome da rua"
                                :disabled="infoPesquisa.bairroId === 0 || infoPesquisa.bairros.length === 0 "
                                v-model="infoPesquisa.logradouroId"
                                :items="infoPesquisa.logradouros"
                                item-value="id"
                                item-text="nome"
                                clearable
                            ></v-select>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text color="secondary" @click="fechaPainel()"> Cancela </v-btn>
                                <v-btn text color="primary" @click="listaPacientes()"> Pesquisa </v-btn>
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
                <v-list-item-group v-model="itemSelecionadoGrid" color="primary" >
                    <v-flex v-for="(item) in lista" :key="item.id">
                    <v-list-item >
                        <v-list-item-avatar>
                            <v-img :src="'https://cdn.vuetifyjs.com/images/lists/1.jpg'"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title v-html="item.nome"></v-list-item-title>
                            <v-list-item-subtitle v-html="item.nome"></v-list-item-subtitle>
                            <v-list-item-subtitle>Endereço</v-list-item-subtitle>
                            <v-list-item-subtitle>Micro Area - Unidade de Saúde</v-list-item-subtitle>
                        </v-list-item-content>
                        <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>

    <!-- <v-list three-line>
        <v-subheader class="justify-center">
            <v-col cols="12"><b>{{tituloLista}}</b></v-col>                    
        </v-subheader>

      <template v-for="(item, index) in items">
        <v-subheader
          v-if="item.header"
          :key="item.header"
          v-text="item.header"
        ></v-subheader>

        <v-divider
          v-else-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item
          v-else
          :key="item.title"
        >
          <v-list-item-avatar>
            <v-img :src="item.avatar"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.title"></v-list-item-title>
            <v-list-item-subtitle v-html="item.subtitle"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list> -->

            <!-- Dfim -->
        </v-container>
    </v-container>
     <!-- <v-layout class="pa-0 ma-0 grey lighten-5" align-content-start justify-end row fill-height>
        <StepBar :etapa="1"/>
        <v-container class="pa-0">ccc
        </v-container>
    </v-layout> -->
</template>
<script>
    import mainService from '../services/MainService'
    import DialogProgressBar from '../components/DialogProgressBar'

    export default {
        components: {
            DialogProgressBar
        },
        data() {
          return {
            telaPronta: false,
            cidadeId: 1,
            itemSelecionadoGrid: 0,
            painelAberto: true,
            infoPesquisa: {
                nomePaciente: '',
                bairroId: 0,
                logradouroId: 0,
                unidadeSaudeId: 0,
                microAreaId: 0,
                bairros: [],
                logradouros: [],
                unidadesSaude: [],
                microAreas: []
            },
            infoDialog: {
                tipo: 0,
                mostra: false,
                mensagem: ''
            },
            lista: []
          }
        },
        mounted() {
            this.buscaDadosIniciais()
        },
        computed: {
            tituloLista: function() {
               let _numeroRegistros = this.lista.length
               let _retorno = (_numeroRegistros == 0) ? 'Não há cidadãos para essa pesquisa' : ` Lista de cidadãos (${_numeroRegistros}) `
               return _retorno
            },
        },
        methods: {
            buscaDadosIniciais() {
                console.log('buscaDadosIniciais.promise.inicio')
                this.mensagemBusca('Buscando alguns dados! Aguarde...')
                Promise.all([
                    mainService.listaUnidadesSaude(this.cidadeId),
                    mainService.listaBairros(this.cidadeId),
                ]).then(([_unidadeSaude, _bairro]) => {

                    console.log('buscaDadosIniciais.promise.then')
                    console.log(_unidadeSaude, _bairro)
                    this.mensagemBusca('')
                    if (_unidadeSaude.status == 200)  
                        this.infoPesquisa.unidadesSaude = _unidadeSaude.data

                    if (_bairro.status == 200)  
                        this.infoPesquisa.bairros = _bairro.data
                });
                console.log('buscaDadosIniciais.promise.fim')
            },
            fechaPainel () {
              this.painelAberto = false
            },
            configuraDialog(mensagem) {
                this.infoDialog.mensagem = mensagem
                this.infoDialog.mostra = (mensagem !== '')
            },
            fechaDialog() {
                this.infoDialog.mostra = false
                this.infoDialog.mensagem = ''
            },
            mensagemErro(mensagem) {
                this.infoDialog.tipo = 1
                this.configuraDialog(mensagem)
            },
            mensagemBusca(mensagem) {
                this.infoDialog.tipo = 0
                this.configuraDialog(mensagem)
            },
            listaPacientes() {
                console.log('listaPacientes-Entrei')
                let _param = {
                    'tipo': 2,
                    'unidadeSaudeId': this.infoPesquisa.unidadeSaudeId,
                    'microAreaId': this.infoPesquisa.microAreaId,
                    'bairroId': this.infoPesquisa.bairroId,
                    'logradouroId': this.infoPesquisa.logradouroId,
                }
                this.mensagemBusca('Consultando dados do cidadão! Aguarde...')
                mainService.listaPacientes(_param)
                .then(_resposta => {
                    console.log('listaPacientes-then', _resposta)
                    this.mensagemBusca('')
                    if (_resposta.status == 200) {
                        this.lista = _resposta.data
                        this.telaPronta = true
                        this.fechaPainel()
                    } else {
                        this.mensagemErro(_resposta.message)
                    }
                })
                .catch(response => {
                    console.log('listaPacientes-catch', '.catch((response)', response)
                    if (response) {
                        let _mensagem = "";
                        response.erros.forEach(el => {
                            _mensagem += el.mensagem;
                        });
                    this.mensagemErro(_mensagem)
                    } else {
                        this.mensagemErro(response.message)
                    }
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
                    this.mensagemBusca('Buscando Micro Áreas... Aguarde')
                    this.infoPesquisa.bairroId = id;
                    mainService.listaLogradouros(this.infoPesquisa.bairroId)
                    .then(resposta => {
                        this.mensagemBusca('')
                        if (resposta.status == 200) {
                            this.infoPesquisa.logradouros = resposta.data;
                        } else {
                            this.mensagemErro(resposta.message)
                        }
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
                    this.mensagemBusca('Buscando Micro Áreas... Aguarde')
                    mainService.listaMicroAreas(this.infoPesquisa.unidadeSaudeId)
                    .then(resposta => {
                        console.log('setaUnidadeSaude.then')
                        this.mensagemBusca('')
                        if (resposta.status == 200) {
                            this.infoPesquisa.microAreas = resposta.data;
                        } else {
                            this.mensagemErro(resposta.message)
                        }
                    })
                }
            },
        }
    }
</script>
