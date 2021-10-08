import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        estaLogado: false,
        infosSistema: {
            nome: '',
            id: '',
            nomePlataforma: '',
            plataformaId: '',
            urlImagem: '',
        },
        infosUsuario: {
            email: '',
            ssoToken: '',
            nomeUsuario: '',
            usuarioId: '',
            usuarioGuid: '',
            apiToken: '',
            autenticado: false,
            cidadePadrao: {
                id: 0,
                nome: ''
            },
            unidadeSaudePadrao: {
                id: 0,
                nome: ''
            },
            bairroPadrao: {
                id: 0,
                nome: ''
            },
            logradouroPadrao: {
                id: 0,
                nome: ''
            },
            microAreaPadrao: {
                id: 0,
                nome: ''
            }
        },
        permissionamento: '',
    },
    mutations: {
        setaPermissao (state, obj) {
            state.permissionamento = obj
        },
        setaConfiguracaoSistema (state,  obj) {
            state.infosSistema.nome = obj.nomeSistema
            state.infosSistema.nomePlataforma = obj.nomePlataforma
            state.infosSistema.plataformaId = obj.plataformaId
            state.infosSistema.id = obj.sistemaId
            state.infosSistema.urlImagem = obj.urlImagem
        }, 
        autenticadoApi (state, obj) {
            state.infosUsuario.autenticado = obj.autenticado
            state.infosUsuario.apiToken = obj.token
            state.infosUsuario.cidadePadrao.id = obj.cidadeId
            state.infosUsuario.cidadePadrao.nome = obj.nomeCidade
            state.infosUsuario.unidadeSaudePadrao.id = obj.unidadeSaudeId
            state.infosUsuario.unidadeSaudePadrao.nome = obj.nomeUnidadeSaude
            state.infosUsuario.bairroPadrao.id = obj.bairroId
            state.infosUsuario.bairroPadrao.nome = obj.nomeBairro
            state.infosUsuario.microAreaPadrao.id = obj.microAreaId
            state.infosUsuario.microAreaPadrao.nome = obj.nomeMicroArea
            state.infosUsuario.logradouroPadrao.id = obj.logradouroId
            state.infosUsuario.logradouroPadrao.nome = obj.nomeLogradouro
        },
        autenticadoSso (state, obj) {
            state.estaLogado = true
            state.sistemaId = obj.sistemaId
            state.infosUsuario.email = obj.email
            state.infosUsuario.ssoToken = obj.token
            state.infosUsuario.apiToken = ''
            state.infosUsuario.nomeUsuario = obj.nomeUsuario
            state.infosUsuario.usuarioId = obj.usuarioId
            state.infosUsuario.usuarioGuid = obj.usuarioGuid
            state.permissionamento = obj.permissionamento
        },
        logout(state) {
            state.estaLogado = false
            state.infosUsuario.autenticado = false
            state.sistemaId = 0
            state.infosUsuario.email = ''
            state.infosUsuario.token = ''
            state.infosUsuario.nomeUsuario = ''
            state.infosUsuario.usuarioId = ''
            state.permissoes = ''
        }, 
    },
    getters: {
        estaLogado: state => state.estaLogado,
        estaAutenticadoApi: state => state.infosUsuario.autenticado,
        email: state => state.infosUsuario.email,
        ssoToken: state => state.infosUsuario.ssoToken,
        apiToken: state => state.infosUsuario.apiToken,
        usuarioId: state => state.infosUsuario.usuarioId,
        usuarioGuid: state => state.infosUsuario.usuarioGuid,
        nomeUsuario: state => state.infosUsuario.nomeUsuario,
        sistemaId: state => state.infosSistema.id,
        nomeSistema: state => state.infosSistema.nome,
        plataformaId: state => state.infosSistema.plataformaId,
        nomePlataforma: state => state.infosSistema.nomePlataforma,
        configuracaoSistema: state => state.configuracaoSistema,
        cidadePadrao: state => state.infosUsuario.cidadePadrao,
        unidadeSaudePadrao: state => state.infosUsuario.unidadeSaudePadrao,
        microAreaPadrao: state => state.infosUsuario.microAreaPadrao,
        bairroPadrao: state => state.infosUsuario.bairroPadrao,
        logradouroPadrao: state => state.infosUsuario.logradouroPadrao,
        permissionamento: state => state.permissionamento,
        autenticadoApi: state => state.infosUsuario.apiToken != ''
    }
  })
  export default store