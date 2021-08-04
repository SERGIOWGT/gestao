import sso from './ssoService'
import api from './apiService'
import store from '../store'

export default {

    // Rotinas da Api
    listaComorbidades: () => {
        var _token = store.getters.apiToken;
        return api.listaComorbidades(_token);
    },
    listaSintomas: () => {
        var _token = store.getters.apiToken;
        return api.listaSintomas(_token);
    },
    listaBairros: (cidadeId) => {
        var _token = store.getters.apiToken;
        return api.listaBairros(_token, cidadeId);
    },
    listaUnidadesSaude: (cidadeId) => {
        var _token = store.getters.apiToken;
        return api.listaUnidadesSaude(_token, cidadeId);
    },
    listaLogradouros: (cidadeId) => {
        var _token = store.getters.apiToken;
        return api.listaLogradouros(_token, cidadeId);
    },
    salvaPaciente: (infoPaciente) => {
        var _token = store.getters.apiToken;
        return api.salvaPaciente(_token, infoPaciente);
    },
    // Rotinas de autenticação
    autentica: (signKey, usuarioGuid) => {
        return api.autentica(signKey, usuarioGuid);
    },
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        return sso.listaPermissionamento(token, usuarioId, sistemaId);
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
    }
}
