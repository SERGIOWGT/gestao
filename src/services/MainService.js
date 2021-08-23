import sso from './ssoService'
import api from './apiService'
import store from '../store'

export default {

    // Rotinas da Api
    listaBairros: (cidadeId) => {
        var _token = store.getters.apiToken;
        return api.listaBairros(_token, cidadeId);
    },
    listaComorbidades: () => {
        var _token = store.getters.apiToken;
        return api.listaComorbidades(_token);
    },
    listaLogradouros: (cidadeId) => {
        var _token = store.getters.apiToken;
        return api.listaLogradouros(_token, cidadeId);
    },
    listaMicroAreas: (unidadeSaudeId) => {
        var _token = store.getters.apiToken;
        return api.listaMicroAreas(_token, unidadeSaudeId);
    },
    listaPacientes: (param) => {
        var _token = store.getters.apiToken;
        return api.listaPacientes(_token, param);
    },
    listaPaciente: (pacienteId) => {
        var _token = store.getters.apiToken;
        return api.listaPaciente(_token, pacienteId);
    },
    listaPacienteSintomas: (pacienteId) => {
        var _token = store.getters.apiToken;
        return api.listaPacienteSintomas(_token, pacienteId);
    },
    listaPacienteComorbidades: (pacienteId) => {
        var _token = store.getters.apiToken;
        return api.listaPacienteComorbidades(_token, pacienteId);
    },
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        return sso.listaPermissionamento(token, usuarioId, sistemaId);
    },
    listaSintomas: () => {
        var _token = store.getters.apiToken;
        return api.listaSintomas(_token);
    },
    listaUnidadesSaude: (cidadeId) => {
        var _token = store.getters.apiToken;
        return api.listaUnidadesSaude(_token, cidadeId);
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

    // Rotinas de autenticação
    autentica: (usuarioGuid) => {
        var _signKey = 'd5f52a0e-f212-11eb-a054-566fe1410274'
        return api.autentica(_signKey, usuarioGuid);
    },
}
