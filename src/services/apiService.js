import axios from 'axios'

axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

const http = axios.create({
    baseURL: 'http://apipainelsaude.azurewebsites.net/api/'
})

export default {
    salvaPaciente: (token, infoPaciente) => {
        console.log('infoPaciente.dataNascimento', infoPaciente.dataNascimento)
        var _numeroEndereco = (infoPaciente.semNumeroEndereco ? 'S/N' : infoPaciente.numeroEndereco)
        var _complemento = (infoPaciente.semComplemento ? '' : infoPaciente.complemento)
        var _celular =  infoPaciente.celular.toString().replace(/\s|-/gm,'');
        var _celular2 =  infoPaciente.celular2.toString().replace(/\s|-/gm,'');
        var _dataNascimento = infoPaciente.dataNascimento.substring(6, 10) + '-' + 
                                infoPaciente.dataNascimento.substring(3, 5) + '-' + 
                                infoPaciente.dataNascimento.substring(0, 2) 

        var _cpf = infoPaciente.cpf.toString().replace(/\.|-/gm,'');
        let _params = {
            'Id' : 0,
            'Nome' : infoPaciente.nome,
            'DataNascimento' : _dataNascimento,
            'CPF': _cpf,
            'CartaoSUS': infoPaciente.numeroSus,
            'Celular' : _celular,
            'Celular2' : _celular2,
            'EMail' : infoPaciente.eMail,
            'Sexo' : 'M',
            'TipoEstadoSaudeId': 1,
            'UnidadeSaudeId': infoPaciente.unidadeSaudeId,
            'LogradouroId' : infoPaciente.logradouroId,
            'NumeroEndereco' : _numeroEndereco,
            'ComplementoEndereco' : _complemento,
            'DescricaoEndereco' : ''
       }
       console.log('infoPaciente', infoPaciente, _params)

       return http.post('pacientes', _params)
    },
    listaComorbidades: (token) => {
        var _url = 'tipoComorbidades'

        return http.get(_url, {
            headers: {
                'Authorization': `bearer ${token}`
            }
        })
    },
    listaSintomas: (token) => {
        var _url = 'tipoSintomas'
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