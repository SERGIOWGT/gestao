import sso from './ssoService'
import api from './apiService'
import store from '../store'

export default {

    // Rotinas da Api
    excluiUnidadeSaude: (id) => {
        var _token = store.getters.apiToken;
        return api.excluiUnidadeSaude(_token, id);
    },
    excluiBairro: (id) => {
        var _token = store.getters.apiToken;
        return api.excluiBairro(_token, id);
    },
    excluiMicroArea: (id) => {
        var _token = store.getters.apiToken;
        return api.excluiMicroArea(_token, id);
    },
    excluiLogradouro: (id) => {
        var _token = store.getters.apiToken;
        return api.excluiLogradouro(_token, id);
    },
    async listaBairros (cidadeId) {
        const _token = store.getters.apiToken;
        return await api.listaBairros(_token, cidadeId);
    },
    async listaComorbidades() {
        const _token = store.getters.apiToken;
        return await  api.listaComorbidades(_token);
    },
    async listaLogradouros (cidadeId) {
        var _token = store.getters.apiToken;
        return await api.listaLogradouros(_token, cidadeId);
    },
    async listaMicroAreas (unidadeSaudeId) {
        const _token = store.getters.apiToken;
        return await api.listaMicroAreas(_token, unidadeSaudeId);
    },
    async listaPacientes (param) {
        var _token = store.getters.apiToken;
        return await api.listaPacientes(_token, param);
    },
    async listaPaciente (pacienteId) {
        var _token = store.getters.apiToken;
        return await api.listaPaciente(_token, pacienteId);
    },
    async listaPacienteSintomas (pacienteId) {
        var _token = store.getters.apiToken;
        return await api.listaPacienteSintomas(_token, pacienteId);
    },
    async listaPacienteComorbidades (pacienteId) {
        var _token = store.getters.apiToken;
        return await api.listaPacienteComorbidades(_token, pacienteId);
    },
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        return sso.listaPermissionamento(token, usuarioId, sistemaId);
    },
    async listaSintomas () {
        var _token = store.getters.apiToken;
        return await api.listaSintomas(_token);
    },
    async listaUnidadesSaude (cidadeId, parteNome) {
        var _token = store.getters.apiToken;
        return await api.listaUnidadesSaude(_token, cidadeId, parteNome);
    },
    salvaPaciente: (infoPaciente) => {
        var _token = store.getters.apiToken;
        return api.salvaPaciente(_token, infoPaciente);
    },
    salvaPacienteComorbidades: (pacienteId, comorbidades) => {
        var _token = store.getters.apiToken;
        return api.salvaPacienteComorbidades(_token, pacienteId, comorbidades);
    },
    salvaPacienteSintomas: (pacienteId, sintomas) => {
        var _token = store.getters.apiToken;
        return api.salvaPacienteSintomas(_token, pacienteId, sintomas);
    },
    salvaUnidadeSaude: (cidadeId, id, nome) => {
        var _token = store.getters.apiToken;
        return api.salvaUnidadeSaude(_token, cidadeId, id, nome);
    },
    salvaBairro: (cidadeId, id, nome) => {
        var _token = store.getters.apiToken;
        return api.salvaBairro(_token, cidadeId, id, nome);
    },
    salvaMicroArea: (unidadeSaudeId, id, nome) => {
        var _token = store.getters.apiToken;
        return api.salvaMicroArea(_token, unidadeSaudeId, id, nome);
    },
    salvaLogradouro: (bairroId, id, nome) => {
        var _token = store.getters.apiToken;
        return api.salvaLogradouro(_token, bairroId, id, nome);
    },
    setaPermissionamento: (permissao) => {
        store.commit('setaPermissao', permissao)
    },
    temAcesso: (funcionalidadeId, tipoFuncionalidadeId, acao) => {
        var _busca = function (linha) {
            var _retorno = false;
            
            if ((linha.funcionalidadeId === funcionalidadeId) && 
                (linha.tipoFuncionalidadeId === tipoFuncionalidadeId)) {

                //Cadastro
                if (linha.tipoFuncionalidadeId == 1)
                { 
                    switch (acao)
                    {
                        case 'C':
                            _retorno = (linha.consulta === 'S' ? true : false);
                            break;
                        case 'A':
                            _retorno = (linha.alteracao === 'S' ? true : false);
                            break;
                        case 'I':
                            _retorno = (linha.inclusao === 'S' ? true : false);
                            break;
                        case 'E':
                            _retorno = (linha.exclusao === 'S' ? true : false);
                            break;
                        default:
                            _retorno = false;
                    }
                } else 
                    _retorno = true;
            }
            return _retorno
        }

        const _array = store.getters.permissionamento
        var _item = _array.find(_busca)
        return !(_item == null) 
    },
    autentica: (usuarioGuid) => {
        var _signKey = 'd5f52a0e-f212-11eb-a054-566fe1410274'
        return api.autentica(_signKey, usuarioGuid);
    },
    catchPadrao: (response) => {
        let mensagemErro = ''
        if (response) {
            let _mensagem = ""
            response.erros.forEach(el => {
                _mensagem += el.mensagem
            });
            mensagemErro=_mensagem
        } else {
            mensagemErro=response.message
        }
        return mensagemErro;
    }
}
