import { http } from './configService'

export default {
    listaPermissionamento: (token, usuarioId, sistemaId) => {
        var _url = `v1/Usuarios/${usuarioId}/ListaPermissionamento?sistemaId=${sistemaId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    }

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