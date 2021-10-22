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
    listaBairros (cidadeId, id) {
        const _token = store.getters.apiToken;
        return api.listaBairros(_token, cidadeId, id);
    },
    listaComorbidades() {
        const _token = store.getters.apiToken;
        return api.listaComorbidades(_token);
    },
    listaDoencas() {
        const _token = store.getters.apiToken;
        return api.listaDoencas(_token); 
    },
    listaLogradouros (bairroId, id) {
        var _token = store.getters.apiToken;
        return api.listaLogradouros(_token, bairroId, id);
    },
    listaMicroAreas (unidadeSaudeId, id) {
        const _token = store.getters.apiToken;
        return api.listaMicroAreas(_token, unidadeSaudeId, id);
    },
    listaPaciente (pacienteId) {
        var _token = store.getters.apiToken;
        return api.listaPaciente(_token, pacienteId);
    },
    listaPacienteComorbidades (pacienteId) {
        var _token = store.getters.apiToken;
        return api.listaPacienteComorbidades(_token, pacienteId);
    },
    listaPacienteSintomas (pacienteId) {
        var _token = store.getters.apiToken;
        return api.listaPacienteSintomas(_token, pacienteId);
    },
    listaPacientes (param) {
        var _token = store.getters.apiToken;
        return api.listaPacientes(_token, param);
    },
    listaPacientesCompleta (param) {
        var _token = store.getters.apiToken;
        return api.listaPacientesCompleta(_token, param);
    },
    listaPacienteUltimaVisita (pacienteId) {
        var _token = store.getters.apiToken;
        return api.listaPacienteUltimaVisita(_token, pacienteId);
    },
    listaPacienteVisitas(pacienteId) {
        var _token = store.getters.apiToken;
        return api.listaPacienteVisitas(_token, pacienteId, null, null);
    },
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        return sso.listaPermissionamento(token, usuarioId, sistemaId);
    },
    listaSintomas () {
        var _token = store.getters.apiToken;
        return api.listaSintomas(_token);
    },
    listaUnidadesSaude (cidadeId, id, parteNome) {
        var _token = store.getters.apiToken;
        return api.listaUnidadesSaude(_token, cidadeId, id, parteNome);
    },
    listaTipoAcaoVisita() {
        const _token = store.getters.apiToken;
        return api.listaTipoAcaoVisita(_token); 
    },
    listaTipoMotivoVisita (id) {
        var _token = store.getters.apiToken;
        return api.listaTipoMotivoVisita(_token, id);
    },
    listaTipoMotivoAnaliticoVisita (id ) {
        var _token = store.getters.apiToken;
        return api.listaTipoMotivoAnaliticoVisita(_token, id);
    },
    listaUsuariosSso: (sistemaId) => {
        const token = store.getters.apiToken;
        return sso.listaUsuarios(token, sistemaId);
    },
    listaUsuariosSistema: (cidadeId) => {
        const token = store.getters.ssoToken;
        return api.listaUsuarios(token, cidadeId);
    },
    listaVisita(id) {
        var _token = store.getters.apiToken;
        return api.listaVisita(_token, id, null);
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
    salvaVisita: (id, params) => {
        var _token = store.getters.apiToken;
        return api.salvaVisita(_token, id, params);
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
        console.log(response)
        let mensagemErro = ''
        if (response) {
            if (response.erros) {
                let _mensagem = ""
                response.erros.forEach(el => {
                    _mensagem += el.mensagem
                });
                mensagemErro=_mensagem
            }
            else
                mensagemErro=response.message

        } else {
            mensagemErro=response.message
        }
        return mensagemErro;
    }
}
