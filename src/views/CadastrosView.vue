<template>
    <v-container fluid style="height: 100vmax;" class="px-2 py-0">
        <DialogProgressBar :mostra="infoDialog.mostra" :tipo="infoDialog.tipo" :mensagem="infoDialog.mensagem" @funcaoRetorno= 'fechaDialog'/>
        <v-card class="pt-0 mt-0" v-if="opcaoAtual == enumCadastro.microArea">
            <v-card-text class="">
                <v-row no-gutters>
                    <v-col cols="12"> <b>Escolha uma unidade de saúde para acessar Cadastro de Micro Áreas</b> </v-col>
                </v-row>
                <v-select class="pt-2"  @input="setaUnidadeSaude"
                    required
                    dense
                    :items="unidadesSaude"
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
                    :items="bairros"
                    item-value="id"
                    item-text="nome"
                    return-object
                ></v-select> 
            </v-card-text>
        </v-card>

        <v-card flat class="pt-0 mt-3" tile v-if="telaPronta" >
            <v-list>
                <v-subheader class="justify-center">
                    <v-col cols="10"><b>{{tituloLista}}</b></v-col>                    
                    <v-col cols="2"><v-btn icon color="green"><v-icon>mdi-plus-circle</v-icon></v-btn></v-col>                    
                </v-subheader>
                <v-divider></v-divider>
                <v-list-item-group v-model="itemSelecionadoGrid" color="primary" >
                    <v-flex v-for="(item) in lista" :key="item.id">
                    <v-list-item >
                        <v-list-item-avatar>
                            <v-icon>{{opcoes[opcaoAtual].icone}}</v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content>
                            <v-list-item-title v-html="item.nome"></v-list-item-title>
                        </v-list-item-content>
                        <v-btn icon><v-icon>mdi-dots-vertical</v-icon></v-btn>
                    </v-list-item>
                    <v-divider></v-divider>
                    </v-flex>
                </v-list-item-group>
            </v-list>
        </v-card>
        <v-bottom-navigation color="teal" grow fixed >
            <v-btn hint="teste" @click="cmdBotao(enumCadastro.unidadeSaude)">
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
import DialogProgressBar from '../components/DialogProgressBar';

export default {
    components: {
        DialogProgressBar
    },
    data() {
          return {
            enumCadastro : {
                unidadeSaude: 0,
                bairro: 1,
                logradouro: 2,
                microArea: 3
            },
            infoDialog: {
              tipo: 0,
              mostra: false,
              mensagem: ''
            },
            itemSelecionadoGrid: 0,
            opcaoAtual: 0,
            opcoes: [
                {icone: 'mdi-bottle-tonic-plus-outline', titulo: 'Unidades de Saúde'},
                {icone: 'mdi-home-group', titulo: 'Bairros'},
                {icone: 'mdi-home-city-outline', titulo: 'Logradouros'},
                {icone: 'mdi-human-capacity-increase', titulo: 'Micro Áreas'}
            ],
            cidadeId: 1,
            titulo: '',
            telaPronta: false,
            lista: [],
            unidadesSaude: [],
            bairros:[],
            mensagemBusca: '',
          }
    },
    created() {
        this.opcaoAtual = 0
    },
    mounted() {
        this.buscaDadosIniciais()
    },
    computed: {
        tituloLista: function() {
            let _retorno = ''
            let _numeroRegistros = this.lista.length
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
    },
    methods: {
        buscaDadosIniciais() {
            console.log('buscaDadosIniciais.promise.inicio')
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            Promise.all([
                mainService.listaUnidadesSaude(this.cidadeId),
                mainService.listaBairros(this.cidadeId),
            ]).then(([_unidadeSaude, _bairro]) => {

                console.log('buscaDadosIniciais.promise.then')
                console.log(_unidadeSaude, _bairro)
                this.mensagemBusca = ''
                if (_unidadeSaude.status == 200)  
                    this.unidadesSaude = _unidadeSaude.data

                if (_bairro.status == 200)  
                    this.bairros = _bairro.data

                this.cmdBotao(this.enumCadastro.unidadeSaude)
                this.telaPronta = true
            });
            console.log('buscaDadosIniciais.promise.fim')
        },
        cmdBotao(value) {
            console.log('cmdBotao-inicio', value)
            this.itemSelecionadoGrid = 0
            this.opcaoAtual = value
            this.mensagemBusca = ''
            if ((value == this.enumCadastro.logradouro) || (value == this.enumCadastro.microArea)) {
                this.telaPronta = false
                this.lista = []
            }
            else  {
                this.telaPronta = true
                this.lista = (value == this.enumCadastro.unidadeSaude) ? this.unidadesSaude : this.bairros
            }
            console.log('cmdBotao-fim', this.opcaoAtual, this.lista)
        },
        setaBairro(value) {
            console.log('setaBairro-inicio', value.id)
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            let _unidadeSaudeId = value.id
            mainService.listaMicroAreas(_unidadeSaudeId).then(resposta => {
                this.mensagemBusca = ''
                console.log('setaBairro-then', resposta)
                if (resposta.status == 200) {
                    this.lista = resposta.data;
                    this.telaPronta = true
                } else {
                    console.log('Erro', resposta.message)
                    this.mensagemErro = resposta.message
                }
            })
        },
        setaUnidadeSaude(value) {
            console.log('setaUnidade-inicio', value.id)
            this.mensagemBusca = 'Buscando alguns dados! Aguarde...'
            let _bairroId = value.id
            mainService.listaLogradouros(_bairroId).then(resposta => {
                console.log('setaUnidade-then', resposta)
                this.mensagemBusca = ''
                if (resposta.status == 200) {
                    this.lista = resposta.data;
                    this.telaPronta = true
                } else {
                    console.log('Erro', resposta.message)
                    this.mensagemErro = resposta.message
                }
            })
            console.log('setaUnidade-Fim')
        },
        fechaDialog() {
            this.infoDialog.mostra = false
            this.infoDialog.mensagem = ''
        },
    }
}
</script>
