<template>
    <v-container fluid style="height: 100vmax;" class="px-2 py-0">
        <BasicDialog :mostra="infoDialog.mensagem != ''" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem"/>
        <v-dialog v-model="infoNovo.mostraDialog" persistent max-width="600px">
            <v-card class="pa-0 ma-0">
                <v-card-title class="pa-2" >
                    <span class="text-h6">{{infoNovo.titulo}}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text class="pa-0">
                    <v-form ref="myForm" class="mx-3" v-model="formularioValido">
                        <v-text-field class="mt-5 pt-2" v-if="infoNovo.labelPai != ''"
                        dense
                        disabled
                        :label="infoNovo.labelPai"
                        v-model="infoNovo.nomePai"
                        ></v-text-field>
                        <v-text-field class="mt-5 pt-2 mb-5" 
                        dense
                        :label="infoNovo.label"
                        :disabled="infoNovo.exclusao == true"
                        required
                        clearable
                        v-model="infoNovo.nome"
                        :rules="[regras.Basicas.obrigatorio()]"
                        counter
                        maxlength="50"
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-0 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn 
                        color="secundary"
                        text
                        @click="infoNovo.mostraDialog = false"
                    >
                        Fechar
                    </v-btn>
                    <v-btn 
                        v-if="infoNovo.exclusao == true"
                        color="error"
                        text
                        @click="exclui()"
                    >
                        Excluir
                    </v-btn>

                    <v-btn
                        v-if="infoNovo.exclusao == false"
                        color="primary"
                        text
                        @click="salva()"
                    >
                        Salvar
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-card class="pt-0 mt-0" v-if="opcaoAtual == enumCadastro.microArea">
            <v-card-text class="">
                <v-row no-gutters>
                    <v-col cols="12"> <b>Escolha uma unidade de saúde para acessar Cadastro de Micro Áreas</b> </v-col>
                </v-row>
                <v-select class="pt-2"  @input="setaUnidadeSaude"
                    required
                    dense
                    v-model="infoSelecionadaComboPesquisa.unidadeSaude"
                    :items="listas.unidadesSaude"
                    item-value="id"
                    item-text="nome"
                    return-object
                ></v-select> 
            </v-card-text>
        </v-card>
        <v-card class="pt-0 mt-0" v-if="opcaoAtual == enumCadastro.logradouro">
            <v-card-text class="">
                <v-row no-gutters>
                    <v-col cols="12"><b>Escolha um Bairro para acessar Cadastro de Logradouros</b> </v-col>
                </v-row>
                <v-select class="pt-2"  @input="setaBairro"
                    required
                    dense
                    v-model="infoSelecionadaComboPesquisa.bairro"
                    :items="listas.bairros"
                    item-value="id"
                    item-text="nome"
                    return-object
                ></v-select> 
            </v-card-text>
        </v-card>
        <v-card flat class="pt-0 mt-3" tile v-if="telaPronta" >
            <v-list>
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
                <v-list-item-group v-model="itemSelecionadoGrid" color="primary" >
                    <v-flex v-for="(item) in listas.tela" :key="item.id">
                    <v-list-item >
                        <v-list-item-content>
                            <v-list-item-title class="text-wrap" v-html="item.nome"></v-list-item-title>
                        </v-list-item-content>
                        <v-btn icon color="primary" @click="configAlteracao(item.id, item.nome, false)"><v-icon>mdi-dots-vertical</v-icon></v-btn>
                        <v-btn icon color="error"  @click="configAlteracao(item.id, item.nome, true)"><v-icon>mdi-minus-circle</v-icon></v-btn>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>
        <v-bottom-navigation color="teal" grow fixed >
            <v-btn @click="cmdBotao(enumCadastro.unidadeSaude)">
                <v-icon>{{opcoes[enumCadastro.unidadeSaude].icone}}</v-icon>
            </v-btn>
            <v-btn  @click="cmdBotao(enumCadastro.microArea)">
                <v-icon>{{opcoes[enumCadastro.microArea].icone}}</v-icon>
            </v-btn>
            <v-btn @click="cmdBotao(enumCadastro.bairro)">
                <v-icon>{{opcoes[enumCadastro.bairro].icone}}</v-icon>
            </v-btn>
            <v-btn  @click="cmdBotao(enumCadastro.logradouro)">
                <v-icon>{{opcoes[enumCadastro.logradouro].icone}}</v-icon>
            </v-btn>
        </v-bottom-navigation>
    </v-container>    
</template>

<script>
import mainService from '../services/MainService'
import BasicDialog from '../components/BasicDialog';
import regrasCampos from '../bibliotecas/regrasCampos'
import store from '../store'

export default {
    components: {
    BasicDialog
    },
    data() {
          return {
            regras: regrasCampos,

            formularioValido: false,

            infoDialog: {
              tipo: 0,
              mensagem: ''
            },
            enumCadastro : {
                unidadeSaude: 0,
                bairro: 1,
                logradouro: 2,
                microArea: 3
            },
            infoNovo: {
                exclusao: false,
                mostraDialog: false,
                labelPai: '',
                label: '',
                paiId: 0,
                nomePai: '',
                id: 0,
                nome: ''
            },
            vetCampos: [
                    {genero: 'F', titulo: 'Unidade de Saúde', posicaoPai: -1},
                    {genero: 'M', titulo: 'Bairro', posicaoPai: -1},
                    {genero: 'M', titulo: 'Logradouro', posicaoPai: 1},
                    {genero: 'F', titulo: 'Micro Área', posicaoPai: 0}
            ],
            itemSelecionadoGrid: 0,
            opcaoAtual: 0,
            opcoes: [
                {icone: 'mdi-bottle-tonic-plus-outline', titulo: 'Unidades de Saúde'},
                {icone: 'mdi-home-group', titulo: 'Bairros'},
                {icone: 'mdi-home-city-outline', titulo: 'Logradouros'},
                {icone: 'mdi-human-capacity-increase', titulo: 'Micro Áreas'}
            ],
            titulo: '',
            telaPronta: false,
            listas: {
                tela:[],
                bairros: [],
                logradouros: [],
                unidadesSaude: [],
                microAreas: []
            },
            infoSelecionadaComboPesquisa: {
                unidadeSaude: {
                    id: 0,
                    nome: ''
                },
                bairro: {
                    id: 0,
                    nome: ''
                },
            }
          }
    },
    created() {
        this.opcaoAtual = -1
    },
    mounted() {
        this.buscaDadosIniciais()
    },
    computed: {
      tituloLista: function() {
        let _retorno = ''
        let _numeroRegistros = this.listas.tela.length
        if (_numeroRegistros == 0) {
            switch (this.opcaoAtual) {
                case this.enumCadastro.unidadeSaude: 
                    _retorno = (_numeroRegistros == 0) ? 'Não há Unidades de Saúde cadastradas no Município' : ''
                    break;
                case this.enumCadastro.bairro: 
                    _retorno = (_numeroRegistros == 0) ? 'Não há Bairros cadastrados no Município' : ''
                    break;
                case this.enumCadastro.logradouro: 
                    _retorno = (_numeroRegistros == 0) ? 'Não há Logradouros cadastrados no Bairro selecionado' : ''
                    break;
                case this.enumCadastro.microArea: 
                    _retorno = (_numeroRegistros == 0) ? 'Não há Micro Áreas cadastradas na Unidade de Saúde selecionada' : ''
                    break;
            }
        } else {
            _retorno = ` ${this.opcoes[this.opcaoAtual].titulo} (${_numeroRegistros} `
            _retorno += (_numeroRegistros == 0) ? ' registro)' : ' registros)'
        }
        return _retorno
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
      }
    },
    methods: {
        tituloTela(posicao) {
            let _retorno = 'Nome ' + (this.vetCampos[posicao].genero == 'F' ? ' da ': ' do ') + this.vetCampos[posicao].titulo
            return _retorno
        },
        listaBairros(cidadeId) {
            this.mensagemBusca = 'Buscando Bairros! Aguarde...'
            mainService.listaBairros(cidadeId)
            .then(_resposta => {
                this.mensagemBusca = ''
                if (_resposta.status == 200)  
                    this.listas.bairros = _resposta.data
             })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        listaLogradouros(bairroId) {
            this.mensagemBusca = 'Buscando Logradouros! Aguarde...'
            mainService.listaLogradouros(bairroId)
            .then(resposta => {
                this.mensagemBusca = ''
                if (resposta.status == 200) {
                    this.listas.tela =this.listas.logradouros = resposta.data;
                    this.telaPronta = true
                } else {
                    console.log('Erro', resposta.message)
                    this.mensagemErro = resposta.message
                }
            })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        listaMicroAreas(unidadeSaudeId) {
            console.log('listaMicroAreas', unidadeSaudeId)
            mainService.listaMicroAreas(unidadeSaudeId)
            .then(resposta => {
                this.mensagemBusca = ''
                if (resposta.status == 200) {
                    this.listas.tela = this.listas.microAreas = resposta.data;
                    this.telaPronta = true
                } else {
                    console.log('Erro', resposta.message)
                    this.mensagemErro = resposta.message
                }
            })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        listaUnidadesSaude(cidadeId) {
            this.mensagemBusca = 'Buscando Unidades de Saúde! Aguarde...'
            mainService.listaUnidadesSaude(cidadeId)
            .then(_resposta => {
                this.mensagemBusca = ''
                if (_resposta.status == 200)  
                    this.listas.tela = this.listas.unidadesSaude = _resposta.data
             })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        novo() {
            this.infoNovo.id = 0
            this.infoNovo.nome = ''
            this.infoNovo.exclusao = false

            this.infoNovo.titulo = (this.vetCampos[this.opcaoAtual].genero == 'F' ? 'Nova ': 'Novo ')
                + this.vetCampos[this.opcaoAtual].titulo

            this.infoNovo.label = this.tituloTela(this.opcaoAtual)
            this.infoNovo.placeholder = 'Informe ' + this.infoNovo.label

            const _posicaoPai = this.vetCampos[this.opcaoAtual].posicaoPai;
            if (_posicaoPai != -1) {
                this.infoNovo.labelPai = this.tituloTela(_posicaoPai)
            } else {
                this.infoNovo.labelPai = ''
                this.infoNovo.paiId = 0
            }
            this.infoNovo.mostraDialog = true
            this.$refs.myForm.reset()
        },
        configAlteracao(id, nome, exclusao) {
            this.infoNovo.exclusao = exclusao

            this.infoNovo.id = id
            this.infoNovo.nome = nome
            this.infoNovo.titulo = (exclusao ? 'Exclusão de ':'Alteração de ')  + this.vetCampos[this.opcaoAtual].titulo
            this.infoNovo.label = this.tituloTela(this.opcaoAtual)
            const _posicaoPai = this.vetCampos[this.opcaoAtual].posicaoPai;
            if (_posicaoPai != -1) {
                this.infoNovo.labelPai = this.tituloTela(_posicaoPai)
            } else {
                this.infoNovo.labelPai = ''
                this.infoNovo.paiId = 0
            }
            this.infoNovo.mostraDialog = true
        },
        buscaDadosIniciais() {
            console.log('buscaDadosIniciais.promise.inicio')
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            Promise.all([
                mainService.listaUnidadesSaude(store.getters.cidadeId),
                mainService.listaBairros(store.getters.cidadeId),
            ])
            .then(([_unidadeSaude, _bairro]) => {

                console.log('buscaDadosIniciais.promise.then')
                console.log(_unidadeSaude, _bairro)
                this.mensagemBusca = ''
                if (_unidadeSaude.status == 200)  
                    this.listas.unidadesSaude = _unidadeSaude.data

                if (_bairro.status == 200)  
                    this.listas.bairros = _bairro.data

                this.cmdBotao(this.enumCadastro.unidadeSaude)
                this.telaPronta = true
             })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
            console.log('buscaDadosIniciais.promise.fim')
        },
        cmdBotao(value) {
            console.log('cmdBotao-inicio', value, this.opcaoAtual)
            if (value != this.opcaoAtual) {
                this.itemSelecionadoGrid = 0
                this.opcaoAtual = value
                this.mensagemBusca = ''

                switch (value) {
                    case this.enumCadastro.logradouro:
                        this.telaPronta = (this.infoSelecionadaComboPesquisa.bairro.id != 0)
                        this.listas.tela = this.listas.logradouros
                        break
                    case this.enumCadastro.microArea:
                        this.telaPronta = (this.infoSelecionadaComboPesquisa.unidadeSaude.id != 0)
                        this.listas.tela = this.listas.microAreas
                        break
                    case this.enumCadastro.unidadeSaude:
                        this.telaPronta = true
                        this.listas.tela = this.listas.unidadesSaude
                        break
                    case this.enumCadastro.bairro:
                        this.telaPronta = true
                        this.listas.tela = this.listas.bairros
                        break
                }

            }
            console.log('cmdBotao-fim', this.opcaoAtual)
        },
        setaBairro(value) {
            console.log('setaBairro-inicio', value.id)
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            this.infoSelecionadaComboPesquisa.bairro.nome = this.infoNovo.nomePai = value.nome
            this.infoSelecionadaComboPesquisa.bairro.id = this.infoNovo.paiId = value.id

            this.listaLogradouros(this.infoNovo.paiId)
        },
        setaUnidadeSaude(value) {
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            this.infoSelecionadaComboPesquisa.unidadeSaude.nome = this.infoNovo.nomePai = value.nome
            this.infoSelecionadaComboPesquisa.unidadeSaude.id = this.infoNovo.paiId = value.id
            this.listaMicroAreas(this.infoNovo.paiId)
        },
        salva() {
            if (this.$refs.myForm.validate()) {
                switch (this.opcaoAtual) {
                    case this.enumCadastro.unidadeSaude: 
                        this.mensagemBusca='Salvando a Unidade de Saúde. Aguarde...'
                        mainService.salvaUnidadeSaude(store.getters.cidadeId, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            console.log('salvaUnidadeSaude', '.then', resposta)
                            this.mensagemBusca=''
                            if (resposta.status == 200) {
                                this.infoNovo.mostraDialog = false
                                this.listaUnidadesSaude(store.getters.cidadeId)
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            mainService.catchPadrao(response)
                        })
                        break;
                    case this.enumCadastro.bairro: 
                        this.mensagemBusca='Salvando o Bairro. Aguarde...'
                        mainService.salvaBairro(store.getters.cidadeId, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            this.mensagemBusca=''
                            if (resposta.status == 200) {
                                this.infoNovo.mostraDialog = false
                                this.listaBairros(store.getters.cidadeId)
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            mainService.catchPadrao(response)
                        })
                        break;
                    case this.enumCadastro.logradouro: 
                        this.mensagemBusca='Salvando o Logradouro. Aguarde...'
                        mainService.salvaLogradouro(this.infoNovo.paiId, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            console.log('salvaLogradouro', '.then', resposta)
                            this.mensagemBusca=''
                            if (resposta.status == 200) {
                                this.infoNovo.mostraDialog = false
                                this.listaLogradouros(this.infoNovo.paiId)
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            mainService.catchPadrao(response)
                        })
                        break;
                    case this.enumCadastro.microArea: 
                        this.mensagemBusca='Salvando a Micro Area. Aguarde...'
                        mainService.salvaMicroArea(this.infoNovo.paiId, this.infoNovo.id, this.infoNovo.nome)
                        .then(resposta => {
                            console.log('salvaMicroArea', '.then', resposta)
                            this.mensagemBusca=''
                            if (resposta.status == 200) {
                                this.infoNovo.mostraDialog = false
                                this.listaMicroAreas(this.infoNovo.paiId)
                            } else {
                                this.mensagemErro=resposta.message
                            }
                        })
                        .catch(response => {
                            mainService.catchPadrao(response)
                        })
                        break;
                }   
            }
        },
        refresh() {
            switch (this.opcaoAtual) {
                case this.enumCadastro.unidadeSaude: 
                    this.listaUnidadesSaude(store.getters.cidadeId)
                    break;
                case this.enumCadastro.bairro: 
                    this.listaBairros(store.getters.cidadeId)
                    break;
                case this.enumCadastro.logradouro: 
                    this.listaLogradouros(this.infoNovo.paiId)
                    break;
                case this.enumCadastro.microArea: 
                    this.listaMicroAreas(this.infoNovo.paiId)
                    break;
            }
        },
        exclui() {
            switch (this.opcaoAtual) {
                case this.enumCadastro.unidadeSaude: 
                    this.mensagemBusca='Apagando a Unidade de Saúde. Aguarde...'
                    mainService.excluiUnidadeSaude(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemBusca=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaUnidadesSaude(store.getters.cidadeId)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        mainService.catchPadrao(response)
                    })
                    break;
                case this.enumCadastro.bairro: 
                    this.mensagemBusca='Apagando o Bairro. Aguarde...'
                    mainService.excluiBairro(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemBusca=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaBairros(store.getters.cidadeId)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        mainService.catchPadrao(response)
                    })
                    break;
                case this.enumCadastro.logradouro: 
                    this.mensagemBusca='Apagando o Logradouro. Aguarde...'
                    mainService.excluiLogradouro(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemBusca=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaLogradouros(this.infoNovo.paiId)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        mainService.catchPadrao(response)
                    })
                    break;
                case this.enumCadastro.microArea: 
                    this.mensagemBusca='Apagando a Micro Area. Aguarde...'
                    mainService.excluiMicroArea(this.infoNovo.id)
                    .then(resposta => {
                        this.mensagemBusca=''
                        if (resposta.status == 200) {
                            this.infoNovo.mostraDialog = false
                            this.listaMicroAreas(this.infoNovo.paiId)
                        } else {
                            this.mensagemErro=resposta.message
                        }
                    })
                    .catch(response => {
                        mainService.catchPadrao(response)
                    })
                    break;
            }
        }
    }
}
</script>
