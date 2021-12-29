<template>
    <v-container fluid style="height: 100vmax;" class="px-2 py-0">
        <MessageBox :tipo="tipoMensagem" :mensagem="mensagem" @cb= 'mensagem = ""'/>        
        <ProgressBar :mensagem="mensagemAguarde"/>
        <TituloPagina titulo="CADASTRO DE USUÁRIOS DO SISTEMA" @cbAnterior="$router.back()"/>
        <Pergunta v-if="infoPergunta.abre" :titulo="infoPergunta.titulo" :pergunta="infoPergunta.texto" @cbRespostaSim="cbRespostaSim()" @cbRespostaNao="cbRespostaNao()"/>
        <v-flex v-if="abreCadastro">
            <v-bottom-sheet persistent v-model="abreCadastro" inset  max-width="500px" >
                <v-sheet class="text-center">
                    <v-card tile class="pa-0 ma-0">
                        <v-card-title class="pa-2 teal lighten-2" >
                            <span class="white--text subtitle-1">{{tituloSheet}}</span>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text class="pa-0">
                            <v-form ref="myForm" class="mx-3" v-model="formularioValido">
                                <v-text-field class="pb-0 pt-4" dense disabled 
                                    label="Cidade"
                                    v-model="cidadePadrao.nome"
                                ></v-text-field>
                                <v-text-field class="pt-0" dense clearable required counter autofocus
                                    :disabled="eExclusao == true"
                                    v-model="infoUsuario.nome"
                                    autocomplete="false"
                                    label="Nome*"
                                    :rules="[regras.Basicas.obrigatorio(), regras.Basicas.min(5), regras.Basicas.max(100)]"
                                    maxlength="100"
                                />
                                <v-text-field dense clearable required counter  class="pt-2"
                                    v-model="infoUsuario.email"
                                    label="Email*"
                                    prepend-icon="mdi-email"
                                    :disabled="infoUsuario.id != 0"
                                    :rules="[regras.Email.valido(false)]"
                                    maxlength="100"
                                    :id="dynamicID()"
                                />
                                <v-text-field class="pt-2" dense clearable v-if="this.infoUsuario.id == 0"
                                    label="Senha"
                                    :id="dynamicID()"
                                    v-model="infoUsuario.senha"
                                    prepend-icon="mdi-lock"
                                    :counter="tamanhoMaximoSenha"
                                    :rules="[rotinasLogin.SenhaRules.min(tamanhoMinimoSenha), rotinasLogin.SenhaRules.max(tamanhoMaximoSenha), rotinasLogin.SenhaRules.valido(formatoSenha, mensagemErroFormatoSenha)]"
                                    :type="!senhaNaoVisivel ? 'password' : 'text'"
                                    :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                                    :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
                                    @click:append="senhaNaoVisivel = !senhaNaoVisivel"
                                />
                                <v-text-field class="pt-2" dense clearable v-if="this.infoUsuario.id == 0"
                                    label="Repita a Senha"
                                    :id="dynamicID()"
                                    v-model="infoUsuario.senha2"
                                    prepend-icon="mdi-lock"
                                    counter
                                    :rules="[rotinasLogin.SenhaRules.mesmaSenha(infoUsuario.senha)]"
                                    :type="!senhaNaoVisivel ? 'password' : 'text'"
                                    :append-icon="senhaNaoVisivel ? 'mdi-eye' : 'mdi-eye-off'"
                                    :append-icon-cb="() => (senhaNaoVisivel = !senhaNaoVisivel)"
                                    @click:append="senhaNaoVisivel = !senhaNaoVisivel"
                                />
                                <v-autocomplete class="pt-2" dense hide-no-data return-object
                                    :disabled="eExclusao == true"
                                    @input="setaPerfil" 
                                    label="Perfil do Usuário*"
                                    v-model="infoUsuario.perfil"
                                    :items="perfis"
                                    item-value="id"
                                    item-text="nome"
                                    prepend-icon="mdi-account-key"
                                    :rules="[regraPerfil()]"
                                ></v-autocomplete> 
                                <v-autocomplete class="pt-2" dense hide-no-data  return-object clearable
                                    @input="setaUnidadeSaude"         
                                    :disabled="eExclusao == true || infoUsuario.perfil.permissaoUnidadeSaude == 'N' || unidadesSaude.length === 0 "
                                    :items="unidadesSaude"
                                    v-model="infoUsuario.unidadeSaude"
                                    label="Unidade de Saúde*"
                                    item-value="id"
                                    item-text="nome"
                                    prepend-icon="mdi-plus"
                                    :rules="[regraUnidadeSaude()]"
                                ></v-autocomplete> 
                                <v-autocomplete class="pt-2" dense hide-no-data clearable
                                    @input="setaMicroArea"                             
                                    :disabled="eExclusao == true || infoUsuario.perfil.permissaoMicroArea == 'N' ||  microAreas.length === 0 "
                                    label="Micro Área*"
                                    :items="microAreas"
                                    v-model="infoUsuario.microArea"
                                    item-value="id"
                                    item-text="nome"
                                    prepend-icon="mdi-human-capacity-increase"
                                    return-object
                                    :rules="[regraMicroArea()]"
                                ></v-autocomplete> 
                            </v-form>
                        </v-card-text>
                        <v-card-actions class="pa-0 ma-0 pr-2 pb-5">
                            <v-spacer></v-spacer>
                            <v-btn text small color="primary" @click="abreCadastro=false" :disabled="salvando">Fechar </v-btn>
                            <v-btn text small color="primary" v-if="eExclusao == true" :disabled="salvando" @click="exclui()">Excluir</v-btn>
                            <v-btn text small color="red" v-if="eExclusao == false" :disabled="!formularioValido || salvando" @click="salva()">Salvar</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-sheet>
            </v-bottom-sheet>
        </v-flex>
        <v-flex v-show="telaPronta" >
            <v-card flat class="pt-0 mt-0" tile >
                <v-chip-group v-model="filtro" column>
                    <v-chip filter outlined>Todas</v-chip>
                    <v-chip filter outlined>Ativos</v-chip>
                    <v-chip filter outlined>Inativos</v-chip>
                </v-chip-group>
                <v-list>
                    <v-divider></v-divider>
                    <v-subheader class="justify-center px-0">
                        <v-col class="px-1" cols="9"><b>{{tituloLista}}</b></v-col>                    
                        <v-col cols="3" >
                            <v-row justify="end">
                                <v-btn icon color="primary" @click="novo()"><v-icon>mdi-plus-circle</v-icon></v-btn>
                                <v-btn icon color="primary" @click="refresh()"><v-icon>mdi-refresh</v-icon></v-btn>
                            </v-row>
                        </v-col> 
                    </v-subheader>
                    <v-divider></v-divider>
                    <v-list-item-group v-model="itemSelecionadoGrid" color="primary" >
                        <v-flex v-for="(item, index) in usuariosTela" :key="item.id">
                        <v-list-item class="px-0">
                                <v-col class="py-0"> 
                                    <v-list-item-title :class="classeItem(item.ativo, item.bloqueado) " v-html="item.nome"/>
                                    <v-list-item-subtitle :class="classeItem(item.ativo, item.bloqueado) " v-html="item.email"/>
                                    <v-list-item-subtitle :class="classeItem(item.ativo, item.bloqueado) " v-html="item.nomePerfilSeguranca"/>
                                    <v-list-item-subtitle :class="classeItem(item.ativo, item.bloqueado)">{{statusUsuario(item.ativo, item.bloqueado)}}</v-list-item-subtitle>
                                </v-col>
                                <v-col cols="2" align="end" class="py-1"> 
                                    <v-btn icon color="primary" :disabled="!habilitaAlteracao(item.ativo, item.perfilSegurancaId)" @click="altera(index)"><v-icon>mdi-cogs</v-icon></v-btn>
                                    <v-flex v-if="!item.ativo"><v-btn icon color="primary" @click="ativa(item.ssoId, false)" :disabled="item.perfilSegurancaId == 1"><v-icon>mdi-account-arrow-up-outline</v-icon></v-btn></v-flex>
                                    <v-flex v-else><v-btn icon color="primary" @click="ativa(item.ssoId, true)" :disabled="item.perfilSegurancaId == 1"><v-icon>mdi-account-arrow-down-outline</v-icon></v-btn></v-flex>
                                </v-col>
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
import Pergunta from '../components/AppDialogConfirm'
import regrasCampos from '../bibliotecas/regrasCampos'
import RotinasLogin from '../lasTec.Login/bibliotecas/rotinasLogin'
import {temAcesso} from '../rotinasProjeto/rotinasProjeto'

export default {
    components: {ProgressBar, MessageBox, TituloPagina, Pergunta},
    data() {
          return {
            regras: regrasCampos,
            rotinasLogin: RotinasLogin,

            cidadePadrao: null,
            plataformaId: 0,

            telaPronta: false,

            infoUsuario: {
                id: 0,
                nome: '',
                email: '',
                senha: '',
                userKey: '',
                ssoId: 0,
                perfilAntigoId: 0,
                unidadeSaude: {
                    id: 0,
                    nome: ''
                },
                microArea: {
                    id: 0,
                    nome: ''
                },
                perfil: {
                    id: 0,
                    nome: '',
                    permissaoUnidadeSaude: 'N',
                    permissaoMicroArea: 'N'
                }
            },

            tipoMensagem: 0,
            mensagem: '',
            mensagemAguarde: '',

            eMaster: false,
            senhaNaoVisivel: true,
            tamanhoMinimoSenha: 0,
            tamanhoMaximoSenha: 0,
            formatoSenha:  '',
            mensagemErroFormatoSenha: '',
            
            formularioValido: false,
            podeSalvar: false,
            salvando: false,
            itemSelecionadoGrid: 0,

            abreCadastro: false,

            eExclusao: false,

            usuarios: [],
            usuariosTela: [],

            filtro: 1,

            perfis: [],
            unidadesSaude: [],
            microAreas: [],

            infoPergunta: {
                titulo: '',
                texto: '',
                abre: false,
                operacao: '',
                usuarioSsoId: 0
            }
        }
    },
    created() {
        this.cidadePadrao = this.$store.getters.cidadePadrao
        this.tamanhoMinimoSenha = this.$store.getters.tamanhoMinimoSenha
        this.tamanhoMaximoSenha = this.$store.getters.tamanhoMaximoSenha
        this.formatoSenha = this.$store.getters.formatoSenha
        this.mensagemErroFormatoSenha = this.$store.getters.mensagemErroFormatoSenha
        this.$store.commit('habilitaUserbar', false)
    },
    async mounted() {
        this.eMaster = temAcesso(this.$store.getters.permissionamento, 100, 2, 'E')
  
        this.plataformaId = this.$store.getters.plataformaId;
        await this.listaPerfis();
        await this.listaUsuarios();
    },
    watch: {
        filtro() {
            this.filtra()
        }
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
            const _numeroRegistros = this.usuariosTela.length
            return (_numeroRegistros == 0) ? 'Não há usuários para serem listados' : (_numeroRegistros == 1) ? ` Um usuário listado  ` : ` ${_numeroRegistros} usuários listados`
        },
        tituloSheet: function() {
            return (this.infoUsuario.id == 0 ? 'Novo ' : this.eExclusao ? 'Exclusão de ' : 'Alteração de ') + 'Usuário do Sistema'
        },

    },
    methods: {
        dynamicID() { return 'dynamicID-' + Math.floor(Math.random() * Date.now().toString()); },

        habilitaAlteracao(itemAtivo, itemPerfilId) {
            return itemAtivo && (this.eMaster || itemPerfilId > 2)
        },
        cbRespostaSim() {
            this.infoPergunta.abre = false
            if (this.infoPergunta.operacao == 'A')
                this.ativaSso(this.infoPergunta.usuarioSsoId)
            else
                this.inativaSso(this.infoPergunta.usuarioSsoId)
        },
        cbRespostaNao() {
            this.infoPergunta.abre = false
        },
        filtra() {
            if (this.filtro == 0) {
                this.usuariosTela = this.usuarios
            } else  {
                const opcao = this.filtro == 1 ? true : false
                this.usuariosTela = this.usuarios.filter(x=>x.ativo == opcao);
            } 
        },
        classeItem: function(ativo, bloqueado) {
            return 'text-wrap '.concat((ativo == false || bloqueado) ? 'red--text' : '')
        },
        statusUsuario: function(ativo, bloqueado) {
            return (ativo ? 'Ativo' : 'Inativo') + (bloqueado ? ' e Bloqueado' : '')
        },
        regraUnidadeSaude: function(){
            if (this.infoUsuario.perfil.permissaoUnidadeSaude !== 'O')
                return true;

            return !!this.infoUsuario.unidadeSaude.id || 'Campo obrigatório'
        },
        regraPerfil: function(){
            return !!this.infoUsuario.perfil.id || 'Campo obrigatório'
        },
        regraMicroArea: function(){
            if (this.infoUsuario.perfil.permissaoMicroArea !== 'O')
                return true;

            return !!this.infoUsuario.microArea.id || 'Campo obrigatório'
        },
        async altera(posicao) {
            //this.eExclusao = exclui
            this.infoUsuario.id = this.usuariosTela[posicao].id
            this.infoUsuario.nome = this.usuariosTela[posicao].nome
            this.infoUsuario.email = this.usuariosTela[posicao].email
            this.infoUsuario.userKey = this.usuariosTela[posicao].userKey

            const _perfil = this.perfis.find(x => x.id == this.usuariosTela[posicao].perfilSegurancaId)

            console.log('perfil de alteração', _perfil)
            if (_perfil) {
                this.infoUsuario.perfil.permissaoUnidadeSaude = _perfil.permissaoUnidadeSaude
                this.infoUsuario.perfil.permissaoMicroArea = _perfil.permissaoMicroArea

                if (this.infoUsuario.perfil.permissaoUnidadeSaude != 'N') {
                    await this.listaUnidadesSaude();
                    this.infoUsuario.unidadeSaude.id = this.usuariosTela[posicao].unidadeSaudeId;
                } else {
                    this.infoUsuario.unidadeSaude.id = 0;
                }

                if (this.infoUsuario.perfil.permissaoMicroArea != 'N') {
                    if (this.usuariosTela[posicao].unidadeSaudeId) {
                        await this.listaMicroAreas(this.usuariosTela[posicao].unidadeSaudeId);
                    } 
                    this.infoUsuario.microArea.id = this.usuariosTela[posicao].microAreaId
                } else {
                    this.infoUsuario.microArea.id = 0
                }

                this.infoUsuario.perfilAntigoId = this.usuariosTela[posicao].perfilSegurancaId
            }

            /*
            this.infoUsuario.perfil.id = 0
            this.infoUsuario.perfil.nome = ''
            this.infoUsuario.perfil.permissaoUnidadeSaude = 'N'            
            this.infoUsuario.perfil.permissaoMicroArea = 'N'
            */

            this.infoUsuario.perfil.id = this.infoUsuario.perfilAntigoId
            this.infoUsuario.perfil.nome = this.usuariosTela[posicao].nomePerfilSeguranca
            this.infoUsuario.ssoId = this.usuariosTela[posicao].ssoId

            this.abreCadastro = true;
        },        
        async exclui() {
        },        
        async ativa(usuarioId, v) {
            this.infoPergunta.titulo = !v ? 'Ativação ' : ' Inativação ' + ' de usuário';
            this.infoPergunta.texto = 'Confirma a ' + (!v ? ' ativa' : ' inativa') + 'ção do usuário?'
            this.infoPergunta.abre = true
            this.infoPergunta.operacao = !v ? 'A' : 'I'
            this.infoPergunta.usuarioSsoId = usuarioId
        },        
        async ativaSso(usuarioSsoId) {
            this.salvando = true;
            this.mensagemAguarde = 'Ativando usuário. Aguarde...'
            await mainService.ativaUsuarioSso(usuarioSsoId)
            .then(resp => {
              this.mensagemAguarde =  ''
              if (resp.status == 204){
                  this.mensagemSucesso = 'Usuário ativado com sucesso.'
                  this.refresh()
              } else {
                  this.mensagemErro =  resp.message
              } 
            })
            .catch(err => {
              this.mensagemAguarde =  ''
              this.mensagemErro =  mainService.catchPadrao(err)
            });
            this.mensagemAguarde =  ''
            this.salvando = false;
        },    
        async inativaSso(usuarioSsoId) {
            this.salvando = true;
            this.mensagemAguarde =  'Inativando usuário. Aguarde...'
            await mainService.inativaUsuarioSso(usuarioSsoId)
            .then(resp => {
              this.mensagemAguarde =  ''
              if (resp.status == 204) {
                  this.mensagemSucesso = 'Usuário inativado com sucesso.'
                  this.refresh()
              }
              else {
                  this.mensagemErro =  resp.message
              } 
            })
            .catch(err => {
              this.mensagemAguarde =  ''
              this.mensagemErro =  mainService.catchPadrao(err)
            });
            this.mensagemAguarde =  ''
            this.salvando = false;
        },
        async listaUsuarios() {
            let usuariosSso = []
            let usuariosSistema = []
            let erroBusca = false;

            this.telaPronta = false
            this.mensagemAguarde = 'Buscando usuários do sistema. Aguarde...'
            await mainService.listaUsuariosSistema(this.cidadePadrao.id)
            .then((resp) => {
                this.mensagemAguarde = ''
                usuariosSistema = resp.status == 200 ? resp.data : []
            })
            .catch((response) => {
                this.mensagemAguarde = '';
                erroBusca = true
                this.mensagemErro =  mainService.catchPadrao(response)
            }) 

            if (erroBusca) {
                return 
            }

            this.mensagemAguarde = 'Buscando usuários do sso. Aguarde...'
            await mainService.listaUsuariosSso(this.plataformaId)
            .then((resp) => {
                this.mensagemAguarde = ''
                usuariosSso = resp.status == 200 ? resp.data : []
            })
            .catch((response) => {
                this.mensagemAguarde = '';
                erroBusca = true
                this.mensagemErro =  mainService.catchPadrao(response)
            })

            if (erroBusca) {
                return 
            }

            this.usuarios = []
            usuariosSistema = usuariosSistema.filter(x => x.perfilSegurancaId > 1);
            usuariosSistema.sort((a, b) => {return a.nome.localeCompare(b.nome)});
            usuariosSistema.forEach((usuarioSistema) => {
                const usuarioSso = usuariosSso.find(sso=>sso.usuarioGuid == usuarioSistema.userKey);
                if (usuarioSso != null) {
                    usuarioSistema.ssoId = usuarioSso.id
                    usuarioSistema.email = usuarioSso.email
                    usuarioSistema.ativo = usuarioSso.ativo
                    usuarioSistema.bloqueado = usuarioSso.bloqueado
                    this.usuarios.push(usuarioSistema);
                }
            });
            this.telaPronta = true
            this.filtra()
        },
        async listaUnidadesSaude() {
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
                this.mensagemAguarde=''
                this.mensagemErro =  mainService.catchPadrao(response)
            })

        },
        async listaMicroAreas(unidadeSaudeId) {
            this.mensagemAguarde = 'Buscando Micro Áreas... Aguarde'
            await mainService.listaMicroAreas(unidadeSaudeId)
            .then(resposta => {
                this.mensagemAguarde=''
                if (resposta.status == 200) {
                    this.microAreas = resposta.data;
                } else {
                    this.mensagemErro=resposta.message
                }
            })
            .catch((response) => {
                this.mensagemAguarde=''
                this.mensagemErro =  mainService.catchPadrao(response)
            })
        },
        async listaPerfis() {
            let erroBusca = false;
            this.mensagemAguarde = 'Buscando Perfis de Acesso. Aguarde...'
            const resp = await mainService.listaPerfisSeguranca()
                .catch((response) => {
                    this.mensagemAguarde = '';
                    erroBusca = true
                    this.mensagemErro =  mainService.catchPadrao(response)
                })

            console.log(resp);

            if (erroBusca) {
                return 
            }
            let _perfil = resp.data.filter(x => {return x.id != 1})
            if (this.eMaster == false) {
                this.perfis = _perfil.filter(x => {return x.id != 2})
            } else 
                this.perfis = _perfil
            this.mensagemAguarde = ''
        },
        novo() {
            this.senhaNaoVisivel = false
            this.salvando = false
            this.infoUsuario.id = 0;
            this.infoUsuario.nome = ''
            this.infoUsuario.email = ''
            this.infoUsuario.senha = ''
            this.infoUsuario.senha2 = ''
            this.infoUsuario.userKey =  ''
            this.infoUsuario.ssoId =  0
            this.infoUsuario.unidadeSaude.id = 0
            this.infoUsuario.unidadeSaude.nome = ''
            this.infoUsuario.microArea.id = 0
            this.infoUsuario.microArea.nome = ''
            this.infoUsuario.perfil.id = 0
            this.infoUsuario.perfil.nome = ''
            this.infoUsuario.perfil.permissaoUnidadeSaude = 'N'            
            this.infoUsuario.perfil.permissaoMicroArea = 'N'
            this.listaPerfis()
            this.abreCadastro = true
        },
        async refresh() {
            await this.listaUsuarios()
        },
        async resetaSenha() {
        },        
        async setaPerfil(obj) {
            this.unidadesSaude = []
            this.microAreas = []
            this.infoUsuario.microArea.id = 0
            this.infoUsuario.unidadeSaude.id = 0
            
            this.infoUsuario.perfil.id =  obj.id
            this.infoUsuario.perfil.permissaoUnidadeSaude = obj.permissaoUnidadeSaude
            this.infoUsuario.perfil.permissaoMicroArea = obj.permissaoMicroArea

            if (obj.permissaoUnidadeSaude == 'N') {
                return;
            }
            this.formularioValido = false

            await this.listaUnidadesSaude();
               
        },
        async setaUnidadeSaude(obj) {
            this.infoUsuario.microArea.id = 0
            this.microAreas = []            

            this.infoUsuario.unidadeSaude.id = obj == null ? 0 : obj.id
            if (this.infoUsuario.permissaoMicroArea == 'N')
                return;

            await this.listaMicroAreas(this.infoUsuario.unidadeSaude.id)
            
        },
        async setaMicroArea(obj) {
            this.infoUsuario.microArea.id = obj == null ? 0 : obj.id;
        },
        async salva() {
            let erro = false

            const _eInclusao = this.infoUsuario.id == 0
            const _perfil = this.perfis.find(x => {return x.id == this.infoUsuario.perfil.id})
            
            let paramSso = {
                nome: this.infoUsuario.nome,
                email: this.infoUsuario.email,
                plataformaId: this.$store.getters.plataformaId,
                grupoAcessoId: _perfil.grupoSsoId,
                usuarioId: 1
            }

            if (_eInclusao) {
                paramSso.senha = this.infoUsuario.senha
            } else {
                const _perfilAntigo = this.perfis.find(x => {return x.id == this.infoUsuario.perfilAntigoId})
                paramSso.grupoAcessoAntigoId = _perfilAntigo.grupoSsoId
            }

            this.salvando = true;
            this.mensagemAguarde =  'Salvando dados do usuário. Aguarde...'
            await mainService.salvaUsuarioSso(this.infoUsuario.ssoId, paramSso)
            .then(resp => {
              if ((resp.status == 200) || (resp.status == 201)) {
                  this.infoUsuario.userKey = resp.data.usuarioGuid
              } else if (resp.status != 204) {
                  this.mensagemAguarde =  ''
                  this.mensagemErro =  resp.message
                  erro = true
              } 
            })
            .catch(err => {
              this.mensagemAguarde =  ''
              erro = true
              this.mensagemErro =  mainService.catchPadrao(err)
            });
            
            if (erro) {
              this.mensagemAguarde =  ''
              this.salvando = false;
              return;
            } 

            let param = {
                nome: this.infoUsuario.nome,
                userKey: this.infoUsuario.userKey,
                cidadeId: this.cidadePadrao.id,
                perfilSegurancaId: this.infoUsuario.perfil.id,
                unidadeSaudeId: this.infoUsuario.unidadeSaude.id,
                microAreaId: this.infoUsuario.microArea.id,
                bairroId: 0,
                logradouroId: 0,
                pacienteId: 0,
                master: 'N'
            }
            if ((this.infoUsuario.perfil.id == 1) || (this.infoUsuario.perfil.id == 2)) {
                param.master = 'S'
            }
            await mainService.salvaUsuario(this.infoUsuario.id, param)
            .then(resp => {
              this.mensagemAguarde =  ''
              if ((resp.status == 200) || (resp.status == 201)) {
                  console.log('salvou')
              } else {
                  this.mensagemErro =  resp.message
                  erro = true
              } 
            })
            .catch(err => {
              this.mensagemAguarde =  ''
              erro = true
              this.mensagemErro =  mainService.catchPadrao(err)
            });
            if (erro) {
              this.salvando = false;
              return;
            }
            this.abreCadastro = false;
            this.mensagemSucesso = 'Usuário ' + (this.infoUsuario.id == 0? 'cadastrado' : 'alterado') + ' com sucesso!' 
            this.refresh();
            this.salvando = false
        }
    }
}
</script>

