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
            apiToken: '',
            cidades: []
        },
        infosCidade: {
            id: 1,
            nome: '...',
        },
        permissionamento: ''
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
            state.infosUsuario.apiToken = obj.token
            state.infosCidade.id = obj.cidadeId
            state.infosCidade.nome = obj.nomeCidade
        },
        autenticadoSso (state, obj) {
            state.estaLogado = true
            state.sistemaId = obj.sistemaId
            state.infosUsuario.email = obj.email
            state.infosUsuario.ssoToken = obj.token
            state.infosUsuario.apiToken = ''
            state.infosUsuario.nomeUsuario = obj.nomeUsuario
            state.infosUsuario.usuarioId = obj.usuarioId
            state.permissionamento = obj.permissionamento
        },
        logout(state) {
            state.estaLogado = false,
            state.sistemaId = 0,
            state.infosUsuario.email = '',
            state.infosUsuario.token = '',
            state.infosUsuario.nomeUsuario = '',
            state.infosUsuario.usuarioId = '',
            state.permissoes = ''
        }
    },
    getters: {
        estaLogado: state => state.estaLogado,
        email: state => state.infosUsuario.email,
        ssoToken: state => state.infosUsuario.ssoToken,
        apiToken: state => state.infosUsuario.apiToken,
        usuarioId: state => state.infosUsuario.usuarioId,
        nomeUsuario: state => state.infosUsuario.nomeUsuario,
        sistemaId: state => state.infosSistema.id,
        nomeSistema: state => state.infosSistema.nome,
        plataformaId: state => state.infosSistema.plataformaId,
        nomePlataforma: state => state.infosSistema.nomePlataforma,
        configuracaoSistema: state => state.configuracaoSistema,
        cidadeId: state => state.infosCidade.id,
        nomeCidade: state => state.infosCidade.nome,
        permissionamento: state => state.permissionamento,
        autenticadoApi: state => state.infosUsuario.apiToken != ''
    }
  })
  export default store