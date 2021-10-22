<template>
    <v-container fluid style="height: 100vmax;" class="px-2 py-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <TituloPagina titulo="CADASTRO DE USUÁRIOS" @cbAnterior="$router.back()"/>
        <v-flex>
            <v-bottom-sheet v-model="abreCadastro" inset  max-width="500px">
                <v-sheet class="text-center">
                    <v-card tile class="pa-0 ma-0">
                        <v-card-title class="pa-2 teal lighten-2" >
                            <span class="white--text subtitle-1">Novo Usuário do Sistema</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-0">
                            <v-form ref="myForm" class="mx-3" v-model="formularioValido">
                                <v-text-field class="pb-0 pt-4" dense disabled
                                    label="Cidade"
                                    v-model="cidadePadrao.nome"
                                ></v-text-field>
                                <v-text-field class="pt-0" dense clearable 
                                    v-model="infoUsuario.nome"
                                    label="Nome*"
                                />
                                <v-text-field dense clearable
                                    v-model="infoUsuario.email"
                                    label="Email*"
                                    prepend-icon="mdi-email"
                                />
                                <v-text-field dense clearable
                                    label="Senha"
                                    prepend-icon="mdi-lock"
                                />
                                <v-text-field dense clearable
                                    label="Repita a Senha"
                                    prepend-icon="mdi-lock"
                                />
                                <v-autocomplete class="pt-0" @input="setaPerfil" 
                                    dense hide-no-data required
                                    label="Perfil do Usuário*"
                                    :items="perfis"
                                    item-value="id"
                                    item-text="nome"
                                    prepend-icon="mdi-account-key"
                                    return-object
                                ></v-autocomplete> 
                                <v-autocomplete class="pt-0" @input="setaUnidadeSaude" 
                                    dense hide-no-data required return-object
                                    :disabled="infoUsuario.informaUnidadeSaude == 'N' || unidadesSaude.length === 0 "
                                    :items="unidadesSaude"
                                    label="Unidade de Saúde*"
                                    item-value="id"
                                    item-text="nome"
                                    prepend-icon="mdi-plus"
                                    
                                ></v-autocomplete> 
                                <v-autocomplete class="pt-0"
                                    dense hide-no-data required
                                    :disabled="infoUsuario.informaMicroArea == 'N' ||  microAreas.length === 0 "
                                    label="Micro Área*"
                                    :items="microAreas"
                                    item-value="id"
                                    item-text="nome"
                                    prepend-icon="mdi-human-capacity-increase"
                                    return-object
                                ></v-autocomplete> 
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
                            <v-spacer></v-spacer>
                            <v-btn text small color="secundary" @click="abreCadastro=false">Fechar </v-btn>
                            <v-btn text small color="error" v-if="eExclusao == true" @click="exclui()">Excluir</v-btn>
                            <v-btn text small color="primary" v-if="eExclusao == false" @click="salva()">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-sheet>
            </v-bottom-sheet>
        </v-flex>
        <v-flex v-show="telaPronta" class="blue">
            <v-card flat class="pt-0 mt-0 red" tile >
                <v-list>
                    <v-subheader class="justify-center px-0">
                        <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                        <v-col cols="3" >
                            <v-row justify="end">
                                <v-btn icon color="teal lighten-2" @click="novo()"><v-icon>mdi-plus-circle</v-icon></v-btn>
                                <v-btn icon color="teal lighten-2" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                            </v-row>
                        </v-col> 
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group v-model="itemSelecionadoGrid" color="primary" >
                        <v-flex v-for="(item) in usuarios" :key="item.id">
                        <v-list-item >
                            <v-row>
                                <v-col cols="10">
                                    <v-list-item-content>
                                        <v-list-item-title class="text-wrap" v-html="item.nome"></v-list-item-title>
                                        <v-list-item-subtitle class="text-wrap" v-html="item.email"></v-list-item-subtitle>
                                        <v-list-item-subtitle class="text-wrap">Perfil</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-col>
                                <v-col cols="2">
                                    <v-btn icon color="teal lighten-2" ><v-icon>mdi-dots-vertical</v-icon></v-btn>
                                    <v-btn icon color="teal lighten-2"><v-icon>mdi-minus-circle</v-icon></v-btn>
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
import MessageBox from '../lastec.components/lastec-messagebox'
import ProgressBar from '../lastec.components/lastec-progressbar'
import TituloPagina from '../components/TituloPagina'

export default {
    components: {ProgressBar, MessageBox, TituloPagina},
    data() {
          return {
            cidadePadrao: null,
            sistemaId: 0,

            telaPronta: false,

            infoUsuario: {
                nome: '',
                email: '',
                senha: '',
                unidadeSaudeId: 0,
                microAreaId: 0,
                perfil: {
                    id: 0,
                    informaUnidadeSaude: 'N',
                    informaMicroArea: 'N'
                }
            },

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            formularioValido: false,
            itemSelecionadoGrid: 0,

            abreCadastro: false,

            eExclusao: false,

            usuarios: [],

            perfis: [
                {id: 2, nome: '1-Master da Prefeitura', informaUnidadeSaude: 'N', informaMicroArea: 'N'},
                {id: 3, nome: '2-Secretário de Saúde', informaUnidadeSaude: 'N', informaMicroArea: 'N'},
                {id: 4, nome: '3-Ajudante Secretário de Saúde', informaUnidadeSaude: 'S', informaMicroArea: 'S'},
                {id: 5, nome: '4-Responsável pela Doença', informaUnidadeSaude: 'O', informaMicroArea: 'N'},
                {id: 6, nome: '5-Agente de Saúde', informaUnidadeSaude: 'O', informaMicroArea: 'O'},
            ],
            unidadesSaude: [],
            microAreas: []

            

        }
    },
    created() {
        this.cidadePadrao = this.$store.getters.cidadePadrao
    },
    mounted() {
        this.sistemaId = this.$store.getters.sistemaId;
              this.lista();
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
        tituloLista: function() {
            const _numeroRegistros = this.usuarios.length
            return (_numeroRegistros == 0) ? 'Não há usuários cadastrados' : (_numeroRegistros == 1) ? ` Um usuário cadastrado  ` : ` ${_numeroRegistros} usuários cadastrados`
        },

    },
    methods: {
        async altera() {
        },        
        async exclui() {
        },        
        async lista() {
            let usuariosSso = []
            let usuariosSistema = []
            let erroBusca = false;

            this.telaPronta = false
            this.mensagemAguarde = 'Buscando usuários do sistema. Aguarde...'
            usuariosSistema = await mainService.listaUsuariosSistema(this.cidadePadrao.id)
            usuariosSistema = usuariosSistema.data;

 /*            .then((resp) => {
                this.mensagemAguarde = ''
                usuariosSistema = resp.status == 200 ? resp.data : []
            })
            .catch((response) => {
                erroBusca = true
                this.mensagemErro =  mainService.catchPadrao(response)
            }) */

            if (erroBusca) {
                this.mensagemAguarde = ''
                return 
            }

            this.mensagemAguarde = 'Buscando usuários do sso. Aguarde...'
            await mainService.listaUsuariosSso(this.sistemaId)
            .then((resp) => {
                this.mensagemAguarde = ''
                usuariosSso = resp.status == 200 ? resp.data : []
            })
            .catch((response) => {
                erroBusca = true
                this.mensagemErro =  mainService.catchPadrao(response)
            })

            this.usuarios = []
            usuariosSistema.sort((a, b) => {return a.nome.localeCompare(b.nome)});
            usuariosSistema.forEach((usuarioSistema) => {
                const usuarioSso = usuariosSso.find(sso=>sso.id = usuarioSistema.userKey);
                if (usuarioSso != null) {
                    usuarioSistema.email = usuarioSso.email;
                    this.usuarios.push(usuarioSistema);
                }
            });
            this.mensagemAguarde = ''
            this.telaPronta = true
        },
        novo() {
            this.abreCadastro = true;
        },
        async refresh() {
            await this.lista()
        },
        async resetaSenha() {
        },        
        cbfimCadastro() {
            console.log('cbfimCadastro()')
            this.abreCadastro = false
        },
        async setaPerfil(obj) {
            this.unidadesSaude = []
            if (obj == null) {
                this.microAreas = []
                return;
            }
            
            this.infoUsuario.perfil.id =  obj.id
            this.infoUsuario.informaUnidadeSaude = obj.informaUnidadeSaude
            this.infoUsuario.informaMicroArea = obj.informaMicroArea

            if (this.infoUsuario.informaMicroArea == 'N') {
                this.microAreas = []
            }

            if (obj.informaUnidadeSaude == 'N') {
                return;
            }
                
            this.mensagemAguarde = 'Buscando Unidades de Saúde... Aguarde'
            await mainService.listaUnidadesSaude(this.cidadePadrao.id)
            .then(resposta => {
                this.mensagemAguarde=''
                if (resposta.status == 200) {
                    this.unidadesSaude = resposta.data;
                } else {
                    this.mensagemErro=resposta.message
                }
            })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        async setaUnidadeSaude(obj) {
            if (obj == null) {
                this.microAreas = []            
            } 
            this.infoUsuario.unidadeSaudeId = obj.id

            if (this.infoUsuario.informaMicroArea == 'N')
                return;
            
            this.mensagemAguarde = 'Buscando Micro Áreas... Aguarde'
            console.log('this.infoUsuario.unidadeSaudeId', this.infoUsuario.unidadeSaudeId)
            await mainService.listaMicroAreas(this.infoUsuario.unidadeSaudeId)
            .then(resposta => {
                this.mensagemAguarde=''
                if (resposta.status == 200) {
                    this.microAreas = resposta.data;
                } else {
                    this.mensagemErro=resposta.message
                }
            })
            .catch((response) => {
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        }
    }
}
</script>
