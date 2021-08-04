import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    baseURL: 'http://apipainelsaude.azurewebsites.net/api/'
})

export default {
    salvaPaciente: (token, infoPaciente) => {
        console.log('infoPaciente', infoPaciente)
        let params = {
            'NomePaciente' : infoPaciente.nome,
            'DataNascimento' : infoPaciente.dataNascimento,
            'NumeroCPF': infoPaciente.cpf,
            'NumeroCartaoSUS': infoPaciente.numeroSus,
            'NumeroCelular' : infoPaciente.celular,
            'Mail' : infoPaciente.eMail,
            'LogradouroId' : infoPaciente.bairroId,
            'NumeroEndereco' : infoPaciente.numero,
            'DescricaoEndereco' : infoPaciente.complemento,
            'NumeroCelular2' : '',
            'UnidadeSaudeId' : "1",
            'Sexo' : 'M',
            'TipoEstadoSaudeId' : "1",
            'NomeEdificio' : '',
            'NomeBloco' : '',
            'NumeroApto' : ''
       }
        return http.post('pacientes', params)
    },
    listaComordidades: (token) => {
        var _url = 'tiposSintomas'

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaSintomas: (token) => {
        var _url = 'tiposComorbidades'
        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaBairros: (token,cidadeId) => {
        var _url = `bairros?cidadeId=${cidadeId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaUnidadesSaude: (token,cidadeId) => {
        var _url = `unidadeSaudes?cidadeId=${cidadeId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaLogradouros: (token,cidadeId) => {
        var _url = `logradouros?bairroId=${cidadeId}`

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    autentica: (signKey, usuarioGuid) => {
        var _url = `/ApiAcessos/ValidarAcesso?signkey=${signKey}&userKey=${usuarioGuid}`

        return http.get(_url)
    },
}