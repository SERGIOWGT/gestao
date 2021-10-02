import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    //baseURL: 'https://lastecweb01.azurewebsites.net/api/'
    baseURL: 'http://sso.painelsaude.com.br/api/'
})

http.interceptors.response.use(function (response) {
    return response
  }, function (error) {
    var _erros = ''
    if (error.response) {
        if (error.response.status == 400) {
            _erros = error.response.data
        } else if (error.response.status == 401) {
             _erros = {erros: [{
                'chave': '000.0401',
                'mensagem': 'Url não autorizada'
            }]}
    
        } else if (error.response.status == 404) {
            _erros = {erros: [{
                'chave': '000.0404',
                'mensagem': 'Url não encontrada'
            }]}

        } else {
            _erros = {erros: [{
                'chave': '000.0000',
                'mensagem': error
            }]}
        }
        console.log(_erros)
    } else {
        _erros = {erros: [{
            'chave': '000.0000',
            'mensagem': error
        }]}
    }

    return Promise.reject(_erros)
  })

export default {
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        var _url = `v1/Usuarios/${usuarioId}/ListaPermissionamento?sistemaId=${sistemaId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaConfiguracao: (sistemaId) => {
        var _url = 'login/listaConfiguracao?tokenSistema='+sistemaId;
        return http.get(_url);
    },
    autentica: (sistemaId, email, senha) => {
        const params = {
            'tokenSistema': sistemaId,
            'chave': email,
            'senha': senha,
            'comPermissoes': true
        }
        console.log('login/autentica', params)
        return http.put('login/autentica', params)
    },
/*     
    listaSistemasPorUsuario: (usuarioId) => {
        return http.get('sistemas/PorUsuario/' + usuarioId)
    },

    // lista usuario
    listaUsuariosPorSistema: (sistemaId) => {
        return http.get('usuarios/PorSistema/' + sistemaId)
    },
    listaUsuariosPorSistemaPorGrupoAcesso: (sistemaId, grupoAcessoId) => {
        return http.get('usuarios/PorSistema/' + sistemaId + '/PorGrupoAcesso/' + grupoAcessoId)
    },
    listaUsuariosPorSistemaPorFuncionalidade: (sistemaId, FuncionalidadeId) => {
        return http.get('usuarios/PorSistema/' + sistemaId + '/PorFuncionalidade/' + FuncionalidadeId)
    },
    // Lista por Grupo de Acesso
    listaPerfisPorSistema: (sistemaId) => {
        return http.get('GruposAcesso/PorSistema/' + sistemaId)
    },
    listaPerfisPorSistemaPorUsuario: (sistemaId, usuarioId) => {
        return http.get('GruposAcesso/PorSistema/' + sistemaId + '/PorUsuario/' + usuarioId)
    },
    listaPerfisPorSistemaPorFuncionalidade: (sistemaId, FuncionalidadeId) => {
        return http.get('GruposAcesso/PorSistema/' + sistemaId + '/PorFuncionalidade/'+ FuncionalidadeId)
    },

    // Lista funcionalidades
    listaFuncionalidadesPorSistema: (sistemaId) => {
        return http.get('funcionalidades/PorSistema/' + sistemaId)
    },
    listaFuncionalidadesPorSistemaPorUsuario: (sistemaId, usuarioId) => {
        return http.get('funcionalidades/PorSistema/' + sistemaId + '/PorUsuario/' + usuarioId)
    },
    listaFuncionalidadesPorSistemaPorGrupoAcesso: (sistemaId, grupoAcessoId) => {
        return http.get('funcionalidades/PorSistema/' + sistemaId + '/PorGrupoAcesso/' + grupoAcessoId)
    }, */
    // POR FUNCIONALIDADE
/*     trataErroHttp: (error) => {
        let mensagem = '';
        if (error.response) {
            error.response.data.forEach(el => {
                mensagem += el.mensagem;
            });
        } else if (error.request) {
            mensagem = error.request;
        } else {
            mensagem = error.message;
        }
        return mensagem
    } */
}