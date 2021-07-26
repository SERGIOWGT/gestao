import { http } from './configService'

export default {
    listaConfiguracao: (sistemaId) => {
        var _url = 'login/listaConfiguracao?tokenSistema='+sistemaId;
        console.log(_url)
        return http.get(_url);
    },
    autentica: (sistemaId, email, senha) => {
        let params = {
            'tokenSistema': sistemaId,
            'chave': email,
            'senha': senha
        }
        return http.put('login/autentica', params)
    },
    recuperaSenha: (sistemaId, email) => {
        let params = {
            'sistemaId': sistemaId,
            'email': email
        }
        return http.post('login/recuperaSenha', params)
    },
    registraUsuario: (plataformaId, sistemaId, nome, email, senha) => {
        let params = {
            'plataformaId': plataformaId,
            'sistemaId': sistemaId,
            'nome': nome,
            'email': email,
            'senha': senha
        }
        return http.post('login/registraUsuario', params)
    },
    trocaSenha: (sistemaId, email, senhaAtual, senhaNova) => {
        let params = {
            'sistemaId': sistemaId,
            'email': email,
            'senhaAtual': senhaAtual,
            'senhaNova': senhaNova
        }
        return http.post('login/trocaSenha', params)
    },
}