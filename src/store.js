import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const enumNomeTabela = {
    config: 'dbg__config',
    comorbidade: 'dbg__comorbidades',
    doenca: 'dbg__doencas',
    sintoma: 'dbg__sintomas'
}

const store = new Vuex.Store({
    state: {
        estaLogado: false,
        loginFinalizado: false,
        userBarAtivo: false,
        infosSistema: {
            nome: '',
            id: '',
            nomePlataforma: '',
            plataformaId: '',
            urlImagem: '',
            tamanhoMaximoSenha: 0,
            tamanhoMinimoSenha: 0,
            formatoSenha: '',
            mensagemErroFormatoSenha: ''
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
        db: {
            tbConfig: {
              dataCarga: '',
              versao: ''
            },
            tbComorbidades: [],
            tbDoencas: [],
            tbSintomas: [],
        },
    },
    mutations: {
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
            state.infosUsuario.email = obj.email
            state.infosUsuario.ssoToken = obj.token
            state.infosUsuario.apiToken = ''
            state.infosUsuario.nomeUsuario = obj.nomeUsuario
            state.infosUsuario.usuarioId = obj.usuarioId
            state.infosUsuario.usuarioGuid = obj.usuarioGuid
            state.permissionamento = obj.permissionamento
        },
        carregaDadosPersistentes(state) {
            state.db.tbComorbidades = JSON.parse(localStorage.getItem(enumNomeTabela.comorbidade) ||'[]');
            state.db.tbDoencas = JSON.parse(localStorage.getItem(enumNomeTabela.doenca) ||'[]');
            state.db.tbSintomas = JSON.parse(localStorage.getItem(enumNomeTabela.sintoma) ||'[]');
        },
        finalizaLogin (state, obj) {
            state.loginFinalizado = obj
        },
        habilitaUserbar (state, obj) {
            state.userBarAtivo = obj
        },
        init(state) {
            if (localStorage.getItem(enumNomeTabela.config)){
                state.db.tbConfig = JSON.parse(localStorage.getItem(enumNomeTabela.config));
            }
            else {
                state.db.tbConfig.dataCarga = '';
                state.db.tbConfig.versao = '';
            }
        },
        limpaDadosPersistentes(state) {
            state.db.tbConfig.dataCarga = '';
            state.db.tbConfig.versao = '';
            state.db.tbComorbidades = [];
            state.db.tbDoencas = [];
            state.db.tbSintomas = [];

            localStorage.removeItem(enumNomeTabela.config);
            localStorage.removeItem(enumNomeTabela.comorbidade);
            localStorage.removeItem(enumNomeTabela.doenca);
            localStorage.removeItem(enumNomeTabela.sintoma);
        },
        logout(state) {
            state.loginFinalizado = false
            state.estaLogado = false
            state.infosUsuario.autenticado = false
            state.infosUsuario.email = ''
            state.infosUsuario.apiToken = ''
            state.infosUsuario.nomeUsuario = ''
            state.infosUsuario.usuarioId = ''
            state.permissionamento = ''
        }, 
        salvaDadosPersistentes(state, dados) {
            state.db.tbComorbidades = dados.comorbidades;
            state.db.tbDoencas = dados.doencas;
            state.db.tbSintomas = dados.sintomas;
    
            state.db.tbConfig.dataCarga = new Date();
            state.db.tbConfig.versao = 'v1.0'

            localStorage.setItem(enumNomeTabela.config, JSON.stringify(state.db.tbConfig));
            localStorage.setItem(enumNomeTabela.comorbidade, JSON.stringify(dados.comorbidades));
            localStorage.setItem(enumNomeTabela.doenca, JSON.stringify(dados.doencas));
            localStorage.setItem(enumNomeTabela.sintoma, JSON.stringify(dados.sintomas));
        },
        setaListaComuns (state, obj) {
            state.listasComuns.sintomas = obj.sintomas
            state.listasComuns.comorbidades = obj.comorbidades
        },
        setaPermissao (state, obj) {
            state.permissionamento = obj
        },
        setaConfiguracaoSistema (state,  obj) {
            state.infosSistema.nome = obj.nomeSistema
            state.infosSistema.nomePlataforma = obj.nomePlataforma
            state.infosSistema.plataformaId = obj.plataformaId
            state.infosSistema.id = obj.sistemaId
            state.infosSistema.urlImagem = obj.urlImagem
            state.infosSistema.tamanhoMaximoSenha = obj.tamanhoMaximoSenha,
            state.infosSistema.tamanhoMinimoSenha = obj.tamanhoMinimoSenha,
            state.infosSistema.formatoSenha = obj.formatoSenha
            state.infosSistema.mensagemErroFormatoSenha = obj.mensagemErroFormatoSenha
        }, 
    },
    getters: {
        //configuracaoSistema: state => state.configuracaoSistema,

        loginFinalizado: state => state.loginFinalizado,
        estaLogado: state => state.estaLogado,
        userBarAtivo: state => state.userBarAtivo && state.loginFinalizado,

        estaAutenticadoApi: state => state.infosUsuario.autenticado,
        email: state => state.infosUsuario.email,
        ssoToken: state => state.infosUsuario.ssoToken,
        apiToken: state => state.infosUsuario.apiToken,
        usuarioId: state => state.infosUsuario.usuarioId,
        usuarioGuid: state => state.infosUsuario.usuarioGuid,
        nomeUsuario: state => state.infosUsuario.nomeUsuario,
        cidadePadrao: state => state.infosUsuario.cidadePadrao,
        unidadeSaudePadrao: state => state.infosUsuario.unidadeSaudePadrao,
        microAreaPadrao: state => state.infosUsuario.microAreaPadrao,
        bairroPadrao: state => state.infosUsuario.bairroPadrao,
        logradouroPadrao: state => state.infosUsuario.logradouroPadrao,
        autenticadoApi: state => state.infosUsuario.apiToken != '',

        permissionamento: state => state.permissionamento,

        tamanhoMinimoSenha: state => state.infosSistema.tamanhoMinimoSenha,
        tamanhoMaximoSenha: state => state.infosSistema.tamanhoMaximoSenha,
        formatoSenha: state => state.infosSistema.formatoSenha,
        mensagemErroFormatoSenha: state => state.infosSistema.mensagemErroFormatoSenha,
        sistemaId: state => state.infosSistema.id,
        nomeSistema: state => state.infosSistema.nome,
        plataformaId: state => state.infosSistema.plataformaId,
        nomePlataforma: state => state.infosSistema.nomePlataforma,

        
        // db
        dbDataCarga (state) {
            if (state.db.tbConfig)
                if (state.db.tbConfig.dataCarga)
                    return state.db.tbConfig.dataCarga
                    
            return null;
        },
        dbDoencas: state => state.db.tbDoencas,
        dbComorbidades: state => state.db.tbComorbidades,
        dbSintomas: state => state.db.tbSintomas,
    }
  })
  export default store