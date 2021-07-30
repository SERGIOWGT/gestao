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
            token: '',
            nomeUsuario: '',
            usuarioId: '',
        },
        infosMunicipio: {
            id: 33221,
            nome: 'Prefeitura Municipal de Guarará',
        },
        permissoes: ''
    },
    mutations: {
        setaPermissao (state, obj) {
            state.permissoes = obj
        },
        setaConfiguracaoSistema (state,  obj) {
            state.infosSistema.nome = obj.nomeSistema
            state.infosSistema.nomePlataforma = obj.nomePlataforma
            state.infosSistema.plataformaId = obj.plataformaId
            state.infosSistema.id = obj.sistemaId
            state.infosSistema.urlImagem = obj.urlImagem
        }, 
        autenticado (state, obj) {
            state.estaLogado = true
            state.sistemaId = obj.sistemaId
            state.infosUsuario.email = obj.email
            state.infosUsuario.token = obj.token
            state.infosUsuario.nomeUsuario = obj.nomeUsuario
            state.infosUsuario.usuarioId = obj.usuarioId
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
        token: state => state.infosUsuario.token,
        usuarioId: state => state.infosUsuario.usuarioId,
        nomeUsuario: state => state.infosUsuario.nomeUsuario,
        sistemaId: state => state.infosSistema.id,
        nomeSistema: state => state.infosSistema.nome,
        plataformaId: state => state.infosSistema.plataformaId,
        nomePlataforma: state => state.infosSistema.nomePlataforma,
        configuracaoSistema: state => state.configuracaoSistema,
        municipioId: state => state.infosMunicipio.id,
        nomeMunicipio: state => state.infosMunicipio.nome,
        permissao: state => state.permissoes
    }
  })
  export default store